<template>
  <div>
    <div class="section-top">
      <div class="fixed-container">
        <Cart class="cart" :payment-type="paymentType" />
        <div class="progress-bar-wrapper">
          <span class="progress-bar-label">購入完了まで</span>
          <ProgressBar :percentage="90" class="progress-bar" />
        </div>
      </div>
    </div>
    <div class="fixed-container">
      <ErrorBox v-if="error" :title="error.title">
        {{ error.message }}
      </ErrorBox>
      <ErrorBox
        v-if="Object.keys(disabledItemDetails).length > 0"
        title="ご利用になれない商品がカート内にあります。"
      >
        ご利用になれない商品がカート内にあります。カート内を編集してください。
      </ErrorBox>
      <section class="order-confirm-section">
        <div class="order-confirm-section-content">
          <ButtonWrapper theme="full" class-name="mt28 mb30">
            <Button
              theme="dark"
              :disabled="disableToOrder"
              :pending="pending"
              @click="handleOrder"
            >
              注文する
            </Button>
          </ButtonWrapper>
          <div class="order-confirm-attention-title">注文確認</div>
          <div class="order-confirm-attention-content">
            入力ありがとうございました。<br />
            入力された情報を確認して、「注文する」ボタンを押せば、注文完了です。
          </div>
        </div>
      </section>
      <section v-if="client" class="order-confirm-section">
        <div class="order-confirm-section-title">お客様情報</div>
        <div class="order-confirm-section-content">
          <address-table :client="client"></address-table>
          <div class="edit-row">
            <div @click="updateClient">
              変更する
              <fa :icon="faChevronRight" />
            </div>
          </div>
          <ClientDialog
            ref="clientDialog"
            :client="client"
            :title="`お客様情報の編集`"
            :on-update-client="onUpdateClient"
          ></ClientDialog>
        </div>
      </section>
      <section class="order-confirm-section">
        <div class="order-confirm-section-title">お支払い方法</div>
        <div class="order-confirm-section-content">
          <div v-show="paymentType === paymentTypeKv.CreditCard">
            <div class="base-table-wrapper mb20">
              <div class="base-table-title">クレジットカード決済</div>
              <table v-if="!cardInfo.useSavedCardInfo" class="base-table w120">
                <tbody>
                  <tr>
                    <th>カード番号</th>
                    <td>{{ cardMaskedPan }}</td>
                  </tr>
                  <tr>
                    <th>有効期限</th>
                    <td>
                      {{
                        `${fillNumber(
                          cardInputCache.creditMonth,
                          2
                        )}/${fillNumber(cardInputCache.creditYear, 2)}`
                      }}
                    </td>
                  </tr>
                  <tr>
                    <th>セキュリティーコード</th>
                    <td>{{ maskedSecurityCode }}</td>
                  </tr>
                  <tr>
                    <th>カード名義人</th>
                    <td>{{ cardInputCache.cardHolderName }}</td>
                  </tr>
                  <tr>
                    <th>お支払い回数</th>
                    <td>{{ paymentMethodLabel }}</td>
                  </tr>
                </tbody>
              </table>
              <table v-else class="base-table w120">
                <tbody>
                  <tr>
                    <th>カード番号下4桁</th>
                    <td>{{ memberCreditCard.customer_info.card_number }}</td>
                  </tr>
                  <tr>
                    <th>お支払い方法</th>
                    <td>{{ paymentMethodLabel }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <AddressTable
              v-if="activeBillingAddress"
              :client="activeBillingAddress"
              :title="`請求先`"
            ></AddressTable>
          </div>
          <div v-show="paymentType !== paymentTypeKv.CreditCard">
            <div class="base-table-wrapper mb20">
              <div class="base-table-title">
                {{ paymentTypeValudLable[paymentType] }}
              </div>
            </div>
          </div>
          <div class="edit-row">
            <div @click="updatePayment">
              変更する
              <fa :icon="faChevronRight" />
            </div>
          </div>
          <PaymentDialog ref="paymentDialog"></PaymentDialog>
        </div>
      </section>
      <section
        v-if="paymentType !== paymentTypeKv.AmazonPay"
        class="order-confirm-section"
      >
        <div class="order-confirm-section-title">お届け先</div>
        <div
          v-if="canSpecifyOtherShippingAddress"
          class="order-confirm-section-content"
        >
          <template v-if="destinationId">
            <AddressTable :client="address"></AddressTable>
            <div class="edit-row">
              <div @click="updateAddress">
                変更する
                <fa :icon="faChevronRight" />
              </div>
            </div>
          </template>
          <template v-else>
            <div class="address-new-row">
              <div class="has-text-right">
                <span @click="handleClickCreateShippingAddress">
                  お届け先を登録する
                  <fa :icon="faChevronRight" />
                </span>
              </div>
              <BaseDialog
                ref="createAddressDialog"
                title="お届け先情報の登録"
                :has-cancel="false"
                ok-text="登録する"
                @ok="handleCreateShippingAddress"
              >
                <ErrorBox
                  v-if="createShippingAddressError"
                  :title="createShippingAddressError.title"
                >
                  <li
                    v-for="(msg, index) in createShippingAddressError.message"
                    :key="index"
                  >
                    {{ msg }}
                  </li>
                </ErrorBox>
                <AddressForm :inputs="newAddress" />
              </BaseDialog>
            </div>
          </template>
        </div>
        <div v-else class="order-confirm-section-content">
          お客様情報に記載された住所
        </div>
        <ClientDialog
          ref="addressDialog"
          :client="address"
          :title="`お届け先情報の編集`"
          :on-update-client="onUpdateAddress"
        ></ClientDialog>
      </section>
      <section v-else class="order-confirm-section">
        <div class="order-confirm-section-title">お届け先情報</div>
        <div class="order-confirm-section-content">
          <AmazonPayAddressTable :destination="amazonDestination" />
          <div class="edit-row">
            <div @click="$router.go(-1)">
              変更する
              <fa :icon="faChevronRight" />
            </div>
          </div>
        </div>
      </section>
      <section class="order-confirm-section">
        <div class="order-confirm-section-title">配送方法とお届け日時</div>
        <div class="order-confirm-section-content">
          <div class="transport-info-wrapper">
            <p class="transport-title">配送会社</p>
            <p class="transport-company">
              {{ deliveryCompany.label }}
            </p>
            <p class="transport-title">お届け希望日時</p>
            <p class="transport-time">{{ transportDateTime }}</p>
            <div class="edit-row">
              <div @click="updateTransport">
                変更する
                <fa :icon="faChevronRight" />
              </div>
            </div>
            <TransportDialog ref="updateTransportDialog"></TransportDialog>
          </div>
        </div>
      </section>
      <section class="order-confirm-section">
        <div class="order-confirm-section-title">ポイント利用</div>
        <div class="order-confirm-section-content">
          <div
            v-if="pointUsage.use_point_type !== usePointTypeKv.None"
            class="point-usage-wrapper"
          >
            <span class="point">{{ pointUsage.use_point }}ポイント</span
            >利用する
          </div>
          <div v-else class="point-usage-wrapper">ポイント利用しない</div>
          <div class="edit-row">
            <div @click="updatePoint">
              変更する
              <fa :icon="faChevronRight" />
            </div>
          </div>
          <PointDialog ref="pointDialog"></PointDialog>
        </div>
      </section>
      <section class="order-confirm-section">
        <div class="order-confirm-section-title">ご要望</div>
        <div class="order-confirm-section-content">
          <div v-if="message.hasMessage" class="message-wrapper">
            {{ messageTypeMessage }}
          </div>
          <div v-else class="message-wrapper">
            {{ hasMessageLabel }}
          </div>
          <div
            v-if="message.hasMessage && messageContent"
            class="message-wrapper"
          >
            {{ messageContent }}
          </div>
        </div>
      </section>
      <section class="order-confirm-section">
        <div class="order-confirm-section-title">クーポン</div>
        <div class="order-confirm-section-content">
          <div
            v-for="(coupon, index) in useCoupons"
            :key="index"
            class="message-wrapper"
          >
            {{ useCouponText(coupon) }}
          </div>
          <div class="edit-row">
            <div @click="handleEditCoupon">
              変更する
              <fa :icon="faChevronRight" />
            </div>
          </div>
        </div>
        <CouponDialog ref="couponDialog" />
      </section>
      <section class="order-confirm-section">
        <div class="order-confirm-section-title">注文内容</div>
        <div class="order-confirm-section-content">
          <OrderInfo
            :div-class="`order-info-wrapper`"
            :show-add-point="false"
          ></OrderInfo>
          <div v-if="products" class="product-list-wrapper">
            <div class="product-list-title">注文商品</div>
            <ul class="product-list">
              <li
                v-for="(product, index) in products"
                :key="index"
                class="product-list-item"
              >
                <ProductItem
                  :product="product"
                  :has-change="false"
                  :disabled-item="
                    disabledItemDetails[product.item_detail_id] !== undefined
                  "
                  :payment-type="paymentType"
                ></ProductItem>
              </li>
            </ul>
          </div>
          <div class="edit-row">
            <div @click="updateProductList">
              変更する
              <fa :icon="faChevronRight" />
            </div>
          </div>
          <ProductListDialog
            ref="productListDialog"
            :payment-type="paymentType"
          ></ProductListDialog>
        </div>
      </section>
      <section class="order-confirm-section">
        <div class="order-confirm-section-content">
          <p class="text center">注文するを押すと、購入が完了します。</p>
          <ButtonWrapper theme="full" class-name="mt10 mb30">
            <Button
              theme="dark"
              :disabled="disableToOrder"
              :pending="pending"
              @click="handleOrder"
            >
              注文する
            </Button>
          </ButtonWrapper>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import dayjs from "dayjs";
import Cart from "@/components/atoms/Cart";
import ProgressBar from "@/components/atoms/ProgressBar";
import AddressTable from "@/components/atoms/AddressTable";
import AmazonPayAddressTable from "@/components/atoms/AmazonPayAddressTable";
import OrderInfo from "@/components/atoms/OrderInfo";
import ErrorBox from "@/components/atoms/ErrorBox";
import ClientDialog from "@/components/atoms/order/ClientDialog";
import TransportDialog from "@/components/pages/order/confirm/TransportDialog";
import PaymentDialog from "@/components/pages/order/confirm/PaymentDialog";
import PointDialog from "@/components/pages/order/confirm/PointDialog";
import ProductListDialog from "@/components/pages/order/confirm/ProductListDialog";
import CouponDialog from "@/components/pages/order/confirm/CouponDialog";
import ProductItem from "@/components/atoms/ProductItem";
import BaseDialog from "@/components/atoms/BaseDialog";
import { extractFlatValidationError } from "@/plugins/vee-validate";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { getWeekDayName } from "@/utils/date";
import { yen, fillNumber } from "@/utils/format";
import AddressForm, {
  createNewInputs,
} from "@/components/pages/order/AddressForm.vue";
import { isUnprocessableEntityError } from "@/plugins/axios";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";

export default {
  components: {
    ProductItem,
    ProductListDialog,
    PointDialog,
    PaymentDialog,
    ClientDialog,
    ErrorBox,
    OrderInfo,
    Cart,
    ProgressBar,
    AddressTable,
    AmazonPayAddressTable,
    TransportDialog,
    CouponDialog,
    BaseDialog,
    AddressForm,
    ButtonWrapper,
    Button,
  },
  beforeRouteEnter(to, from, next) {
    if (!["cart-order", "cart-order-amazon-pay-info"].includes(from.name)) {
      return next(false);
    }

    next();
  },
  async asyncData({ store, $auth }) {
    await $auth.fetchUser();
    await Promise.all([
      store.dispatch("memberCreditCard/fetch"),
      store.dispatch("master/fetch"),
    ]);

    store.commit("common/pending", false);
  },
  middleware: "auth",
  data() {
    return {
      payment: undefined,
      billing: undefined,
      error: null,
      createShippingAddressError: null,
      newAddress: createNewInputs(),
    };
  },
  computed: {
    faChevronRight() {
      return faChevronRight;
    },
    ...mapGetters({
      enumKv: "enum/kv",
      enumValueLabel: "enum/valueLabel",
      amazonDestination: "order/amazonDestination",
      paymentTypes: "master/orderPaymentTypes",
      cart: "cart/cart",
      client: "user",
      destinations: "destination/destinations",
      destinationId: "order/destinationId",
      activeBillingAddress: "order/activeBillingAddress",
      pointUsage: "order/pointUsage",
      products: "cart/products",
      paymentType: "order/paymentType",
      cardInfo: "order/cardInfo",
      cardMaskedPan: "order/cardMaskedPan",
      maskedSecurityCode: "order/maskedSecurityCode",
      transport: "order/transport",
      message: "order/message",
      usePointTypeKv: "order/usePointTypeKv",
      cardInputCache: "order/cardInputCache",
      priceInfo: "order/priceInfo",
      useCoupons: "cart/useCoupons",
      useCouponIds: "cart/useCouponIds",
      couponDiscountTypeKv: "cart/couponDiscountTypeKv",
      errorCodeKv: "order/errorCodeKv",
      memberCreditCard: "memberCreditCard/data",
      pending: "common/pending",
    }),
    messageContent() {
      return this.message.content;
    },
    address() {
      const destinations = this.destinations;
      const destinationId = this.destinationId;
      return destinations.find(
        (destination) => destination.id === Number(destinationId)
      );
    },
    deliveryCompany() {
      const companyValue = this.transport.delivery_type;
      const deliveryTypes = this.$store.getters["master/orderDeliveryTypes"];
      return deliveryTypes.find(
        (deliveryType) => deliveryType.value === Number(companyValue)
      );
    },
    transportDate() {
      const transportDate = this.transport.delivery_hope_date;

      if (!transportDate) {
        return null;
      }

      const date = dayjs(transportDate);

      const year = date.year();
      const month = date.month() + 1;
      const day = date.date();
      const dayOfWeek = getWeekDayName(date.day());

      return `${year}/${month}/${day}（${dayOfWeek}）`;
    },
    transportDateTime() {
      const hopeTimelabels = this.enumValueLabel.order__delivery_time || {};
      const hasTimelabels = this.enumValueLabel.order__has_time || {};
      const hasTime = this.transport.delivery_has_time;

      if (!hasTime) {
        return hasTimelabels[hasTime];
      }

      const transportDate = this.transportDate;
      const transportTimeValue = this.transport.delivery_hope_time;
      const transportTimeLabel = hopeTimelabels[transportTimeValue];

      return `${transportDate}   ${transportTimeLabel}`;
    },
    disabledItemDetails() {
      if (!this.cart) {
        return {};
      }

      return this.cart.disabledItemDetails || {};
    },
    disableToOrder() {
      return Object.keys(this.disabledItemDetails).length > 0;
    },
    paymentMethodLabel() {
      const paymentMethod = this.cardInfo.method;
      const labels = this.enumValueLabel.order__payment_method || {};

      return labels[paymentMethod];
    },
    hasMessageLabel() {
      const hasMessage = this.message.hasMessage;
      const labels = this.enumValueLabel.order__has_message || {};

      return labels[hasMessage] || null;
    },
    messageTypeMessage() {
      const messageType = this.message.type;
      const labels = this.enumValueLabel.order__request || {};

      return labels[messageType];
    },
    paymentTypeKv() {
      return this.enumKv.order__payment_type || {};
    },
    paymentTypeValudLable() {
      return this.enumValueLabel.order__payment_type || {};
    },
    diabledSpecifyingOtherShippingAddressPaymentTypes() {
      const { NP, Cod } = this.paymentTypeKv;
      return [NP, Cod];
    },
    canSpecifyOtherShippingAddress() {
      const paymentTypes = this
        .diabledSpecifyingOtherShippingAddressPaymentTypes;
      return !paymentTypes.includes(this.paymentType);
    },
  },
  methods: {
    yen(...args) {
      return yen(...args);
    },
    fillNumber(...args) {
      return fillNumber(...args);
    },
    async handleOrder() {
      try {
        this.$store.commit("common/pending", true);
        const params = this.$store.getters["order/confirmedFormData"];

        await this.$store.dispatch("order/create", { params });

        this.error = null;
        this.$router.push("/cart/order/complete");
      } catch (error) {
        if (isUnprocessableEntityError(error)) {
          const { data } = error.response;

          if (data.error_code === this.errorCodeKv.NoValidCartItem) {
            this.error = {
              title: "注文処理に失敗しました。",
              message:
                "ご購入いただける商品がありませんでした。カートの内容をご確認ください。",
            };
            await this.$store.dispatch("order/commitOrderResponse", data);
            this.$store.commit("cart/setCartFromResponse", data.cart_data);
            return;
          }
        }

        const errorMessages = extractFlatValidationError(error);

        this.error = {
          title: "注文処理に失敗しました。",
          message: errorMessages[0],
        };
      } finally {
        this.$store.commit("common/pending", false);
      }
    },
    updateClient() {
      this.$refs.clientDialog.show();
    },
    async onUpdateClient(client) {
      try {
        await this.$store.dispatch("updateUser", { params: { ...client } });
        return;
      } catch (error) {
        const errorMessages = extractFlatValidationError(error);
        return {
          title: "お客様情報の編集に失敗しました。",
          message: errorMessages[0],
        };
      }
    },
    updateAddress() {
      this.$refs.addressDialog.show();
    },
    async onUpdateAddress(address) {
      try {
        await this.$store.dispatch("destination/update", address);
        return null;
      } catch (error) {
        const messages = extractFlatValidationError(error);
        return {
          title: "お届け先情報の編集に失敗しました。",
          message: messages[0],
        };
      }
    },
    updateTransport() {
      this.$refs.updateTransportDialog.show({
        inputs: this.transport,
      });
    },
    updatePayment() {
      this.$refs.paymentDialog.show({
        billingAddress: this.activeBillingAddress,
        paymentType: this.paymentType,
        cardInfo: this.cardInfo,
        cardInputCache: this.cardInputCache,
      });
    },
    updatePoint() {
      this.$refs.pointDialog.show({
        inputs: this.pointUsage,
        cartId: this.cart.id,
      });
    },
    updateProductList() {
      this.$refs.productListDialog.show();
    },
    handleEditCoupon() {
      this.$refs.couponDialog.show({
        useCouponIds: this.useCouponIds,
        paymentType: this.paymentType,
      });
    },
    useCouponText(coupon) {
      const name = coupon.name;
      const limitDate = coupon.end_dt
        ? dayjs(coupon.end_dt).format("YYYY/MM/DD HH:mm")
        : "";
      const discountContent = this.useCouponDiscountContent(coupon);

      return [name, limitDate, discountContent]
        .filter((value) => value)
        .join(" ");
    },
    useCouponDiscountContent(coupon) {
      if (coupon.free_shipping_flag) {
        return "送料無料";
      }

      switch (Number(coupon.discount_type)) {
        case this.couponDiscountTypeKv.Fixed:
          return `${yen(coupon.discount_amount)}引き`;

        case this.couponDiscountTypeKv.Percentile:
        default:
          return `${coupon.discount_rate}%引き`;
      }
    },
    handleClickCreateShippingAddress() {
      this.$refs.createAddressDialog.show();
    },
    async handleCreateShippingAddress() {
      try {
        this.createShippingAddressError = null;
        await this.$store.dispatch("destination/create", this.newAddress);
        this.$refs.createAddressDialog.hide();
        this.newAddress = createNewInputs();

        const destination = this.destinations[0];

        this.$store.commit("order/setDestinationId", destination.id);
      } catch (error) {
        this.createShippingAddressError = {
          title: "お届け先情報の追加に失敗しました。",
          message: extractFlatValidationError(error),
        };
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.edit-row {
  text-align: right;
  margin-top: 10px;
}
.section-top {
  text-align: right;
  padding: 25px 0 15px;
  border-bottom: 1px solid #aaa;
  .cart {
    margin-bottom: 25px;
  }
  .progress-bar-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .progress-bar-label {
      font-size: 10px;
      margin-right: 10px;
    }
    .progress-bar {
      flex: 1;
    }
  }
}
.order-confirm-section {
  margin-bottom: 30px;
  .order-confirm-section-title {
    border-bottom: 1px solid $black;
    margin: 0 -5px 20px;
    padding: 0 5px;
  }
}
.order-confirm-attention-title {
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  border-bottom: 1px solid $black;
  margin: 0 -5px 16px;
  padding: 0 5px;
}
.order-confirm-attention-content {
  font-size: 12px;
  line-height: 22px;
}
.transport-info-wrapper {
  position: relative;
  .transport-title {
    font-size: 10px;
    font-weight: 600;
    margin-bottom: 6px;
  }
  .transport-company {
    font-size: 14px;
    margin-bottom: 30px;
    vertical-align: middle;
    img {
      vertical-align: middle;
    }
  }
  .transport-time {
    font-size: 10px;
  }
  .edit-button-row {
    position: absolute;
    right: 0;
    bottom: 0;
  }
}
.base-table-wrapper {
  .base-table-title {
    font-size: 14px;
    padding: 0 5px;
    &.fs10 {
      font-size: 10px;
      font-weight: 600;
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
.point-usage-wrapper {
  font-size: 14px;
  .point {
    font-size: 16px;
    font-weight: 600;
  }
}
.message-wrapper {
  font-size: 12px;
  line-height: 22px;
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
            .original-price {
              color: #6c6c6c;
              margin-right: 5px;
            }
          }
        }
      }
    }
  }
}
.text {
  font-size: 12px;
}
.center {
  text-align: center;
}
.mt10 {
  margin-top: 10px;
}
.mt28 {
  margin-top: 28px;
}
.mb20 {
  margin-bottom: 20px;
}
.mb30 {
  margin-bottom: 30px;
}
</style>
