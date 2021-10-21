<template>
  <div class="fixed-container">
    <div class="order-section-wrapper">
      <div class="section-left pc-only">
        <OrderLeft />
      </div>
      <div class="section-main">
        <ErrorBox v-if="hasError" :title="errors.title">
          <ul>
            <li v-for="(msg, index) in errors.messages" :key="index">
              {{ msg }}
            </li>
          </ul>
        </ErrorBox>
        <div class="section-top sp-only">
          <OrderHeader
            :progress-percentage="progressPercentage"
            :payment-type="inputs.paymentType"
          />
          <ConfirmButton
            :disabled="invalidProcedureForm"
            @click="handleConfirm"
          ></ConfirmButton>
        </div>
        <slot
          name="formSections"
          :inputs="inputs"
          :localCardInputCache="localCardInputCache"
          :handleUpdateDestination="handleUpdateDestination"
          :handleUpdateTransportValidation="handleUpdateTransportValidation"
          :handleUpdatePaymentValidation="handleUpdatePaymentValidation"
          :handleUpdatePointUsageValidation="handleUpdatePointUsageValidation"
          :handleUpdateMessageValidation="handleUpdateMessageValidation"
        >
          <OrderClientSection />
          <OrderPaymentSection
            class="bg"
            :payment-type.sync="inputs.paymentType"
            :card-info.sync="inputs.cardInfo"
            :billing-address="activeBillingAddress"
            :card-input-cache="localCardInputCache"
            @update:validation="handleUpdatePaymentValidation"
          />
          <OrderAddressSection
            v-model="inputDestinationId"
            :can-specify="canSpecifyOtherShippingAddress"
            class="bg"
            @input="
              handleUpdateDestination({
                invalid:
                  canSpecifyOtherShippingAddress && inputDestinationId === null,
              })
            "
          />
          <OrderTransportSection
            :inputs="inputs.transport"
            @update:validation="handleUpdateTransportValidation"
          />
          <OrderPointUsageSection
            :inputs="inputs.pointUsage"
            @update:validation="handleUpdatePointUsageValidation"
          />
          <OrderMessageSection
            class="bg"
            :inputs="inputs.message"
            @update:validation="handleUpdateMessageValidation"
          />
        </slot>
        <div class="sp-only">
          <ConfirmButton
            :disabled="invalidProcedureForm"
            @click="handleConfirm"
          ></ConfirmButton>
        </div>
      </div>
      <div class="section-right pc-only">
        <OrderRight
          :confirm-disabled="invalidProcedureForm"
          :show-add-point="!isGuestForm"
          @confirm="handleConfirm"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { createNewInputs } from "@/components/pages/order/AddressForm";
import ErrorBox from "@/components/atoms/ErrorBox";
import OrderHeader from "@/components/pages/order/OrderHeader";
import OrderLeft from "@/components/pages/order/OrderLeft";
import OrderRight from "@/components/pages/order/OrderRight";
import OrderClientSection from "@/components/pages/order/OrderClientSection";
import OrderAddressSection from "@/components/pages/order/OrderAddressSection";
import OrderTransportSection from "@/components/pages/order/OrderTransportSection";
import OrderPaymentSection from "@/components/pages/order/OrderPaymentSection";
import OrderPointUsageSection from "@/components/pages/order/OrderPointUsageSection";
import OrderMessageSection from "@/components/pages/order/OrderMessageSection";
import ConfirmButton from "@/components/atoms/order/ConfirmButton";
import { extractFlatValidationError } from "@/plugins/vee-validate";
import {
  createFormParams,
  createGuestPurchaseFormParams,
} from "@/helpers/order";
import { isUnprocessableEntityError } from "~/plugins/axios";

export const FORM_TYPE_NORMAL = "normal";
export const FORM_TYPE_AMAZON_PAY = "amazon_pay";
export const FORM_TYPE_GUEST = "guest";

export default {
  components: {
    ConfirmButton,
    ErrorBox,
    OrderHeader,
    OrderLeft,
    OrderRight,
    OrderClientSection,
    OrderAddressSection,
    OrderTransportSection,
    OrderPaymentSection,
    OrderPointUsageSection,
    OrderMessageSection,
  },
  props: {
    amazonPayInfo: {
      type: Object,
      default: null,
    },
    formType: {
      type: String,
      default: FORM_TYPE_NORMAL,
    },
    progressPercentPerItem: {
      type: Number,
      default: 18,
    },
  },
  middleware: "auth",
  data() {
    return {
      errors: {
        title: "",
        messages: [],
      },
      inputs: {},
      innerDestinationInvalid: true,
      transportInvalid: true,
      paymentInvalid: true,
      pointUsageInvalid: true,
      messageInvalid: true,
      localCardInputCache: {},
      validationFlagDict: {
        default: [
          "pointUsageInvalid",
          "destinationInvalid",
          "transportInvalid",
          "paymentInvalid",
          "messageInvalid",
        ],
        [FORM_TYPE_GUEST]: [
          "destinationInvalid",
          "transportInvalid",
          "paymentInvalid",
          "messageInvalid",
        ],
      },
    };
  },
  computed: {
    ...mapGetters({
      user: "user",
      cart: "cart/cart",
      destinations: "destination/destinations",
      enumKv: "enum/kv",
      usablePoints: "point/amount",
      paymentType: "order/paymentType",
      cardInfo: "order/cardInfo",
      activeBillingAddress: "order/activeBillingAddress",
      transport: "order/transport",
      pointUsage: "order/pointUsage",
      message: "order/message",
      defaultDestinationId: "order/defaultDestinationId",
      usePointTypeKv: "order/usePointTypeKv",
      cardInputCache: "order/cardInputCache",
      errorCodeKv: "order/errorCodeKv",
      memberCreditCard: "memberCreditCard/data",
    }),
    destinationInvalid: {
      set(value) {
        this.innerDestinationInvalid = value;
      },
      get() {
        if (this.canSpecifyOtherShippingAddress) {
          return this.innerDestinationInvalid;
        }

        return false;
      },
    },
    isGuestForm() {
      return this.formType === FORM_TYPE_GUEST;
    },
    paymentTypeKv() {
      return this.enumKv.order__payment_type || {};
    },
    paymentMethodKv() {
      return this.enumKv.order__payment_method || {};
    },
    orderRequestKv() {
      return this.enumKv.order__request || {};
    },
    hasError() {
      return this.errors.messages && this.errors.messages.length > 0;
    },
    inputDestinationId: {
      set(value) {
        this.$set(this.inputs, "destinationId", value);
      },
      get() {
        return this.inputs.destinationId;
      },
    },
    invalidProcedureForm() {
      const flags = this.validationFlagNames;

      return flags.some((flag) => this[flag]);
    },
    progressPercentage() {
      const progress = this.progressPercentPerItem;
      const flags = this.validationFlagNames;

      return flags.reduce((sum, flag) => sum + (this[flag] ? 0 : progress), 0);
    },
    diabledSpecifyingOtherShippingAddressPaymentTypes() {
      const { NP, Cod } = this.paymentTypeKv;
      return [NP, Cod];
    },
    canSpecifyOtherShippingAddress() {
      const paymentTypes = this
        .diabledSpecifyingOtherShippingAddressPaymentTypes;
      return !paymentTypes.includes(this.inputs.paymentType);
    },
    validationFlagNames() {
      const flags = this.validationFlagDict[this.formType];

      return flags || this.validationFlagDict.default;
    },
  },
  beforeMount() {
    this.initializeInputs();

    if (this.formType !== FORM_TYPE_AMAZON_PAY) {
      this.handleUpdateDestination({
        invalid: this.inputs.destinationId === null,
      });
    }

    this.localCardInputCache = { ...this.cardInputCache };
  },
  methods: {
    getDefaultPaymentType(formType) {
      switch (formType) {
        case FORM_TYPE_AMAZON_PAY:
          return this.paymentTypeKv.AmazonPay;

        case FORM_TYPE_GUEST:
          return this.paymentTypeKv.CreditCard;

        case FORM_TYPE_NORMAL:
        default:
          return this.paymentType ?? this.paymentTypeKv.CreditCard;
      }
    },
    initializeInputs() {
      const inputs = {};

      if (this.formType !== FORM_TYPE_GUEST) {
        inputs.destinationId = this.defaultDestinationId;
      } else {
        inputs.shippingAddress = createNewInputs();
      }

      inputs.paymentType = this.getDefaultPaymentType(this.formType);
      inputs.transport = { ...this.transport };
      inputs.pointUsage = { ...this.pointUsage };
      inputs.message = { ...this.message };
      inputs.cardInfo = { ...this.cardInfo };

      if (this.memberCreditCard) {
        inputs.cardInfo.useSavedCardInfo = true;
        inputs.cardInfo.memberCreditCardId = this.memberCreditCard.id;
        inputs.cardInfo.method = this.memberCreditCard.payment_method;
      }

      this.inputs = inputs;
    },
    buildOrderFormParams(isGuest) {
      const inputs = { ...this.inputs };

      inputs.amazonPayInfo = this.amazonPayInfo;
      inputs.destinationId = this.inputDestinationId;
      inputs.billingAddress = { ...this.activeBillingAddress };

      if (isGuest) {
        return createGuestPurchaseFormParams(inputs, this.$store.getters);
      }

      return createFormParams(
        inputs,
        this.user,
        this.cart,
        this.paymentTypeKv,
        this.usePointTypeKv,
        this.usablePoints
      );
    },
    async handleConfirm() {
      try {
        this.$store.commit("common/pending", true);
        const isGuest = this.formType === FORM_TYPE_GUEST;

        const params = this.buildOrderFormParams(isGuest);

        if (isGuest) {
          await this.$store.dispatch("order/confirmGuestOrder", params);
        } else {
          await this.$store.dispatch("order/confirmOrder", params);
        }

        this.$store.commit("order/setCardInputCache", {
          ...this.localCardInputCache,
        });

        if (isGuest) {
          this.$router.push("/cart/guest-order/confirm");
        } else {
          this.$router.push("/cart/order/confirm");
        }
      } catch (error) {
        console.error(error);

        if (isUnprocessableEntityError(error)) {
          const { data } = error.response;

          if (data.error_code === this.errorCodeKv.NoValidCartItem) {
            this.errors = {
              title: "注文処理に失敗しました。",
              messages: [
                "ご購入いただける商品がありませんでした。カートの内容をご確認ください。",
              ],
            };
            await this.$store.dispatch("order/commitOrderResponse", data);
            this.$store.commit("cart/setCartFromResponse", data.cart_data);
            return;
          }
        }

        const errorMessages = extractFlatValidationError(error);

        this.errors = {
          title: "注文内容確認に失敗しました。",
          messages: errorMessages,
        };
      }
    },
    handleUpdateDestination({ invalid }) {
      this.destinationInvalid = invalid;
    },
    handleUpdateTransportValidation({ invalid }) {
      this.transportInvalid = invalid;
    },
    handleUpdatePaymentValidation({ invalid }) {
      this.paymentInvalid = invalid;
    },
    handleUpdatePointUsageValidation({ invalid }) {
      this.pointUsageInvalid = invalid;
    },
    handleUpdateMessageValidation({ invalid }) {
      this.messageInvalid = invalid;
    },
  },
};
</script>

<style lang="scss" scoped>
.order-section-wrapper {
  display: flex;
  padding: 50px 0;
  @include touch {
    padding: 30px 0;
  }
  .section-left {
    width: 180px;
    margin-right: 50px;
  }
  .section-main {
    flex: 1;
    width: 100%;
  }
  .section-right {
    width: 220px;
    margin-left: 50px;
  }
}
.section-top {
  text-align: right;
  padding: 25px 0 15px;
  border-bottom: 1px solid #aaa;
}
.base-table-wrapper {
  margin: 0 -5px;
  @include desktop {
    margin-left: 0;
    margin-right: 0;
  }
  .base-table-title {
    font-size: 14px;
    padding: 0 5px;
    &.fs10 {
      font-size: 10px;
      font-weight: 600;
    }
    &.flex {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  .base-table {
    &.w120 {
      th {
        width: 120px;
      }
    }
  }
}
.order-info-wrapper {
  .order-info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    padding: 6px 0;
  }
  .order-sum-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 1;
    padding: 16px 0;
    .order-sum-label {
      .big {
        font-size: 14px;
      }
      .small {
        font-size: 10px;
      }
    }
    .order-sum-value {
      color: $error;
      font-size: 14px;
      font-weight: 600;
    }
  }
}
.product-list-wrapper {
  .product-list-title {
    font-size: 14px;
    margin: 20px 0 10px;
  }
  .product-list {
    > .product-list-item {
      .product-item {
        display: flex;
        margin-bottom: 10px;
        > .product-image-wrapper {
          width: 80px;
          margin-right: 10px;
        }
        > .product-info-wrapper {
          flex: 1;
          line-height: 1.4;
          > .product-brand {
            font-size: 10px;
            margin-bottom: 5px;
          }
          > .product-title {
            font-size: 12px;
            margin-bottom: 10px;
          }
          > .product-uuid {
            font-size: 10px;
            margin-bottom: 5px;
          }
          > .product-color {
            font-size: 10px;
          }
          > .product-size {
            font-size: 10px;
            margin-bottom: 6px;
          }
          > .product-cost {
            text-align: right;
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
