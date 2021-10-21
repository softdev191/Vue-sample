<template>
  <transition
    name="dropdown"
    @before-enter="beforeEnter"
    @enter="enter"
    @before-leave="beforeLeave"
    @leave="leave"
  >
    <div v-show="showCredit" class="dropdown-section-content">
      <div class="dropdown-section-content-inner">
        <div class="payment-credit-wrapper">
          <img src="@/assets/images/credit_card.png" alt="" />
        </div>
        <template v-if="memberCreditCard">
          <div class="use-saved-card-info mb10">
            <div class="use-saved-card-info-use">
              <Radio
                id="use_saved_card_info_1"
                :value="useSavedCardInfo"
                :option-value="true"
                text="保存したカード情報を使う"
                name="use_saved_card_info"
                @input="handleUpdateUseSavedCardInfo"
              />
              <div class="card-info">
                <div class="card-number">
                  下4桁:
                  {{ memberCreditCard.customer_info.card_number }}
                </div>
                <div class="card-expiry">
                  {{ memberCreditCard.customer_info.expiry_month }}/{{
                    memberCreditCard.customer_info.expiry_year
                  }}
                </div>
              </div>
              <Button class="delete-button" @click="handleDeleteCardInfo"
                >削除</Button
              >
            </div>
            <Radio
              id="use_saved_card_info_0"
              :value="useSavedCardInfo"
              :option-value="false"
              text="新しいカード情報を入力する"
              name="use_saved_card_info"
              @input="handleUpdateUseSavedCardInfo"
            />
          </div>
          <div v-if="useSavedCardInfo" class="full-divider mb20"></div>
        </template>
        <div v-show="!useSavedCardInfo">
          <TextField
            v-model="cardInputCache.creditNumber"
            wrapper-class="form-group"
            :rules="{
              required: !useSavedCardInfo && isCreditCardSelected,
            }"
            label="カード番号"
            name="card-no"
            type="number"
            :disabled="Boolean(useSavedCardInfo)"
            @input="handleChangeCardNo"
          />
          <div class="form-group">
            <label class="form-label" for="card-expire-month">有効期限</label>
            <div class="card-expire-wrapper">
              <SelectField
                v-model="cardInputCache.creditMonth"
                wrapper-class="select-wrapper"
                :rules="{
                  required: !useSavedCardInfo && isCreditCardSelected,
                }"
                name="expiry-month"
                valid-name="有効期限 (月)"
                select-class="form-control"
                :disabled="Boolean(useSavedCardInfo)"
                :use-unselect-option="true"
                :unselect-option="{ name: '', id: null }"
                :option-items="monthOptions"
                @input="handleChangeExpiryMonth"
              />
              <span>月</span>
              <SelectField
                v-model="cardInputCache.creditYear"
                wrapper-class="select-wrapper"
                :rules="{
                  required: !useSavedCardInfo && isCreditCardSelected,
                }"
                name="expiry-year"
                valid-name="有効期限 (年)"
                select-class="form-control"
                :disabled="Boolean(useSavedCardInfo)"
                :use-unselect-option="true"
                :unselect-option="{ name: '', id: null }"
                :option-items="yearOptions"
                @input="handleChangeExpiryYear"
              />
              <span>年</span>
            </div>
          </div>
          <TextField
            v-model="securityCode"
            wrapper-class="form-group"
            :rules="{
              required: !useSavedCardInfo && isCreditCardSelected,
            }"
            label="セキュリティーコード"
            type="number"
            input-class="form-control w175"
            name="card-code"
            :disabled="Boolean(useSavedCardInfo)"
            @input="handleChangeSecurityCode"
          >
            <InformationMessage>
              <template v-slot:message>
                セキュリティーコードは、カードの裏面に記載されている3桁の数字、または、表面に記載されている4桁の数字のことです。<br />
                上記以外の記載の場合もありますので、詳しくはご利用のカード会社の方にお問い合わせください。
              </template>
            </InformationMessage>
          </TextField>
          <TextField
            v-model="cardInputCache.cardHolderName"
            wrapper-class="form-group"
            :rules="{
              required: !useSavedCardInfo && isCreditCardSelected,
            }"
            label="カード名義人"
            name="card-holder-name"
            :disabled="Boolean(useSavedCardInfo)"
            @input="handleChangeCardHolderName"
          />
          <div v-if="!hideSaveCardInfoOption" class="form-group center">
            <div class="form-check-wrapper my20 mr16">
              <input
                id="save_card"
                :value="Number(isSaveCardInfo)"
                class="form-checkbox"
                type="checkbox"
                name="save_card"
                :disabled="Boolean(useSavedCardInfo)"
                @input="
                  (event) =>
                    $emit('update:isSaveCardInfo', Number(event.target.checked))
                "
              />
              <label class="form-label" for="save_card">
                このカード情報を保存/更新する
              </label>
            </div>
            <InformationMessage>
              <template v-slot:message>
                次回からは登録カードを利用して決済することができます。<br />
                また、ご請求が発生した場合は登録カードより決済を行います。
              </template>
            </InformationMessage>
            <div class="full-divider mb20"></div>
          </div>
        </div>
        <div class="form-group mb20">
          <SelectField
            :value="paymentMethod"
            vid="payment-method"
            select-wrapper-class="select-wrapper"
            :rules="{
              required: isCreditCardSelected,
            }"
            select-class="form-control"
            :use-unselect-option="true"
            :option-items="paymentMethodOptions"
            label="お支払い方法"
            name="payment-method"
            @input="(value) => $emit('update:paymentMethod', value)"
          />
        </div>
        <div
          v-if="!hideBillingAddress && billingAddress"
          class="base-table-wrapper mb20"
        >
          <div class="base-table-title fs10 flex mb20">
            <div class="base-table-title-label">請求先</div>
            <div class="edit-row">
              <div @click="handleUpdateBillingAddress">
                変更する
                <fa :icon="faChevronRight" />
              </div>
            </div>
            <ClientDialog
              ref="dialog"
              :client="billingAddress"
              :title="`請求先情報の編集`"
              :on-update-client="billingAddressUpdateHandler"
            ></ClientDialog>
          </div>
          <table class="base-table">
            <tbody>
              <tr>
                <th>お名前</th>
                <td>
                  {{ `${billingAddress.lname} ${billingAddress.fname} 様` }}
                </td>
              </tr>
              <tr>
                <th>お名前（カナ）</th>
                <td>
                  {{ `${billingAddress.lkana} ${billingAddress.fkana} 様` }}
                </td>
              </tr>
              <tr>
                <th>電話番号</th>
                <td>{{ billingAddress.tel }}</td>
              </tr>
              <tr>
                <th>郵便番号</th>
                <td>{{ billingAddress.zip }}</td>
              </tr>
              <tr>
                <th>住所</th>
                <td>
                  {{
                    billingAddressPrefName +
                    billingAddress.city +
                    billingAddress.town +
                    billingAddress.address
                  }}<br />
                  {{ billingAddress.building }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <BaseDialog
        ref="deleteCardInfoDialog"
        ok-text="削除"
        @ok="events.emit('deleteCardInfoOk')"
        @cancel="events.emit('deleteCardInfoCancel')"
        @close="events.emit('deleteCardInfoCancel')"
        @out="events.emit('deleteCardInfoCancel')"
      >
        <ErrorMessage v-if="deleteCardInfoDialogError">
          {{ deleteCardInfoDialogError }}
        </ErrorMessage>
        カード情報を削除します。よろしいですか？
      </BaseDialog>
    </div>
  </transition>
</template>

<script>
import EventEmitter from "events";
import dayjs from "dayjs";
import { mapGetters } from "vuex";
import ClientDialog from "@/components/atoms/order/ClientDialog";
import InformationMessage from "@/components/molecules/InformationMessage";
import TextField from "@/components/atoms/TextField";
import SelectField from "@/components/atoms/SelectField";
import Radio from "@/components/atoms/Radio";
import Button from "@/components/atoms/Button";
import BaseDialog from "@/components/atoms/BaseDialog";
import ErrorMessage from "@/components/atoms/form/ErrorMessage";
import * as logger from "@/utils/log";
import { extractFlatValidationError } from "@/plugins/vee-validate";
import * as errorCode from "@/constants/f-regi/errorCode";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default {
  components: {
    ClientDialog,
    InformationMessage,
    TextField,
    SelectField,
    Radio,
    Button,
    BaseDialog,
    ErrorMessage,
  },
  props: {
    showCredit: {
      type: Boolean,
      default: false,
    },
    paymentType: {
      type: Number,
      default: null,
    },
    isSaveCardInfo: {
      type: [Number, Boolean],
      default: 0,
    },
    useSavedCardInfo: {
      type: [Boolean, Number],
      default: 0,
    },
    memberCreditCardId: {
      type: Number,
      default: null,
    },
    paymentMethod: {
      type: String,
      default: null,
    },
    billingAddress: {
      type: Object,
      default: null,
    },
    cardInputCache: {
      type: Object,
      default: () => ({}),
    },
    hideSaveCardInfoOption: {
      type: Boolean,
      default: false,
    },
    hideBillingAddress: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      securityCode: "",
      lastResultCode: null,
      deleteCardInfoDialogError: null,
      events: new EventEmitter(),
    };
  },
  computed: {
    ...mapGetters({
      enumKv: "enum/kv",
      constants: "master/constants",
      cardPaymentMethods: "master/orderPaymentMethod",
      paymentMethodOptions: "order/paymentMethodOptions",
      prefs: "master/prefs",
      prefNameById: "master/prefNameById",
      memberCreditCard: "memberCreditCard/data",
    }),
    shopId() {
      return this.constants.f_regi.shop_id;
    },
    apiKey() {
      return this.constants.f_regi.api_key;
    },
    paymentTypeKv() {
      return this.enumKv.order__payment_type || {};
    },
    billingAddressPrefName() {
      const billingAddress = this.billingAddress;
      return this.prefNameById(billingAddress.pref_id);
    },
    frToken() {
      if (typeof window === "undefined") {
        return null;
      }

      return window.FRToken || null;
    },
    monthOptions() {
      return [...new Array(12)].map((_, i) => i + 1);
    },
    yearOptions() {
      const thisYear = dayjs().year();

      return [...new Array(10)].map((_, i) => {
        const name = thisYear + i;

        return {
          name,
          id: String(name).substr(2, 2),
        };
      });
    },
    isCreditCardSelected() {
      return this.paymentType === this.paymentTypeKv.CreditCard;
    },
    faChevronRight() {
      return faChevronRight;
    },
  },
  methods: {
    handleChangeCardNo() {
      this.handleChangeCardInfo();
    },
    handleChangeExpiryMonth() {
      this.handleChangeCardInfo();
    },
    handleChangeExpiryYear() {
      this.handleChangeCardInfo();
    },
    handleChangeCardHolderName() {
      this.handleChangeCardInfo();
    },
    handleChangeSecurityCode() {
      this.handleChangeCardInfo();
    },
    handleUpdateUseSavedCardInfo(value) {
      const memberCreditCardId = value ? this.memberCreditCard.id : null;
      this.$emit("update:useSavedCardInfo", value);
      this.$emit("update:memberCreditCardId", memberCreditCardId);
    },
    async handleChangeCardInfo() {
      try {
        const cardInfo = await this.requestToken();

        this.$emit("update:cardInfo", {
          ...cardInfo,
          maskedSecurityCode: (this.securityCode || "").replace(/\d/g, "●"),
        });
      } catch (error) {
        logger.error(error);
      }
    },
    async requestToken() {
      const cardNo = this.cardInputCache.creditNumber;
      const expiryMonth = String(this.cardInputCache.creditMonth || "");
      const expiryYear = String(this.cardInputCache.creditYear);
      const cardName = this.cardInputCache.cardHolderName;
      const cardCode = this.securityCode;
      const shopId = this.shopId;
      const apiKey = this.apiKey;

      if (!cardNo || !expiryMonth || !expiryYear || !cardName || !cardCode) {
        return;
      }

      return await new Promise((resolve, reject) => {
        const frReceiveCallback = (response) => {
          const data = this.receive(response);
          resolve(data);
        };

        // グローバルで関数定義しないとエラーが発生する
        window[frReceiveCallback.name] = frReceiveCallback;

        this.frToken.getToken(
          shopId,
          apiKey,
          {
            pan: cardNo,
            expiry_mm: expiryMonth,
            expiry_yy: expiryYear,
            cardname: cardName,
            scode: cardCode,
          },
          frReceiveCallback
        );
      });
    },
    receive(response) {
      const info = response.cardobject;

      logger.debug("response: ", response);

      this.lastResultCode = response.result;

      switch (response.result) {
        case errorCode.SUCCESS:
          return {
            cardMaskedPan: info.maskedpan,
            cardToken: info.token,
            cardValidity: info.validity,
          };

        default:
          throw new Error("failed to fetch card info");
      }
    },
    // validateLastResultCode() {
    //   switch (this.lastResultCode) {
    //     case errorCode.SUCCESS:
    //       return true;

    //     case errorCode.INVALID_CARD_NUMBER:
    //       throw new Error("カード番号が正しくありません。");

    //     case errorCode.INVALID_EXPIRY_MONTH:
    //       throw new Error("カード有効期限(月)が正しくありません。");

    //     case errorCode.INVALID_EXPIRY_YEAR:
    //       throw new Error("カード有効期限(年)が正しくありません。");

    //     case errorCode.INVALID_OWNER_NAME:
    //       throw new Error("カード名義が正しくありません。");

    //     case errorCode.INVALID_SECURITY_CODE:
    //       throw new Error("セキュリティコードが正しくありません。");

    //     case errorCode.INVALID_SHOP_ID:
    //     case errorCode.INVALID_API_KEY:
    //     case errorCode.SYSTEM_ERROR:
    //     default:
    //       throw new Error(
    //         "只今、カード決済はご利用になれません。別の支払方法をお試しください。"
    //       );
    //   }
    // },
    handleUpdateBillingAddress() {
      this.$refs.dialog.show();
    },
    async billingAddressUpdateHandler(client) {
      try {
        this.$store.commit("common/pending", true);
        const params = {
          lname: client.lname,
          fname: client.fname,
          lkana: client.lkana,
          fkana: client.fkana,
          tel: client.tel,
          zip: client.zip,
          pref_id: client.pref_id,
          city: client.city,
          town: client.town,
          address: client.address,
          building: client.building,
        };

        await this.$store.dispatch("billingAddress/updateOrCreate", { params });

        this.$emit("update:billingAddress", params);

        return null;
      } catch (error) {
        console.error(error);
        const errorMessages = extractFlatValidationError(error);
        return {
          title: "請求先情報の編集に失敗しました。",
          message: errorMessages,
        };
      } finally {
        this.$store.commit("common/pending", false);
      }
    },
    async handleDeleteCardInfo() {
      try {
        this.$refs.deleteCardInfoDialog.show();

        const result = await new Promise((resolve) => {
          this.events.once("deleteCardInfoOk", () => resolve(true));
          this.events.once("deleteCardInfoCancel", () => resolve(false));
        });

        if (!result) {
          this.$refs.deleteCardInfoDialog.hide();
          return;
        }

        this.$store.commit("common/pending", true);

        await this.$store.dispatch("memberCreditCard/delete", {
          id: this.memberCreditCard.id,
        });

        this.deleteCardInfoDialogError = null;
        this.$refs.deleteCardInfoDialog.hide();
        this.$emit("update:useSavedCardInfo", false);
      } catch (error) {
        console.error(error);
        const messages = extractFlatValidationError(error);
        this.deleteCardInfoDialogError = messages[0];
      } finally {
        this.$store.commit("common/pending", false);
      }
    },

    beforeEnter(el) {
      el.style.height = "0";
    },
    enter(el) {
      el.style.height = el.scrollHeight + "px";
    },
    beforeLeave(el) {
      el.style.height = el.scrollHeight + "px";
    },
    leave(el) {
      el.style.height = "0";
    },
  },
};
</script>
<style lang="scss" scoped>
.form-group.use-saved-card-form-group {
  margin-bottom: 8px;
}
.use-saved-card-info {
  margin-bottom: 10px;
  margin-left: -5px;

  .checkbox {
    .label {
      border: none !important;
    }
  }
  .use-saved-card-info-use {
    display: flex;
    justify-content: space-between;

    .card-info {
      padding-top: 10px;
      .card-number,
      .card-expiry {
        display: inline-block;
      }
    }

    ::v-deep {
      .checkbox {
        max-width: 198px;
        .label {
          border-bottom: 0;
        }
      }
      .delete-button {
        margin-bottom: 0;
        margin-top: 5px;
        .button {
          width: 54px;
          height: 30px;
        }
      }
    }
  }
}
.base-table-title-label {
  font-size: 14px;
  display: inline-block;
  @include desktop {
    width: 80%;
  }
  @include touch {
    width: 70%;
  }
}
.current-point-row {
  font-size: 10px;
  text-align: center;
  .current-point {
    font-size: 16px;
    font-weight: 600;
  }
}
::v-deep .w175 {
  max-width: 175px;
}
.card-expire-wrapper {
  display: flex;
  align-items: center;
  .select-wrapper {
    width: 150px;
  }
  > span {
    font-size: 14px;
    margin: 0 10px;
  }
}
.form-check-wrapper {
  display: inline-block;
}
.dropdown-section {
  .dropdown-section-content {
    transition: 150ms ease-out;
    @include desktop {
      height: auto !important;
    }
    .dropdown-section-content-inner {
      transition: 150ms ease-out;
    }
  }
}
.edit-row {
  text-align: right;
  margin-top: 10px;
  font-size: 12px;
}
.center {
  text-align: center;
}
</style>
