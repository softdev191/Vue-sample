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
      <section v-if="guestSihippingAddress" class="order-confirm-section">
        <div class="order-confirm-section-title">お届け先</div>
        <div class="order-confirm-section-content">
          <AddressTable
            :client="guestSihippingAddress"
            :show-email="true"
          ></AddressTable>
          <div class="edit-row">
            <div @click="handleUpdateSihippingAddress">
              変更する
              <fa :icon="faChevronRight" />
            </div>
          </div>
          <ClientDialog
            ref="sihippingAddressDialog"
            :client="guestSihippingAddress"
            title="お届け先の編集"
            :on-update-client="handleSihippingAddressUpdated"
          ></ClientDialog>
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
        <div class="order-confirm-section-title">お支払い方法</div>
        <div class="order-confirm-section-content">
          <div>
            <div class="base-table-wrapper mb20">
              <div class="base-table-title">クレジットカード決済</div>
              <table class="base-table w120">
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
            </div>
          </div>
          <div class="edit-row">
            <div @click="updatePayment">
              変更する
              <fa :icon="faChevronRight" />
            </div>
          </div>
          <GuestPaymentDialog ref="paymentDialog"></GuestPaymentDialog>
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
import OrderInfo from "@/components/atoms/OrderInfo";
import ErrorBox from "@/components/atoms/ErrorBox";
import ClientDialog from "@/components/atoms/order/ClientDialog";
import TransportDialog from "@/components/pages/order/confirm/TransportDialog";
import GuestPaymentDialog from "@/components/pages/order/confirm/GuestPaymentDialog";
import ProductListDialog from "@/components/pages/order/confirm/ProductListDialog";
import ProductItem from "@/components/atoms/ProductItem";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";
import { extractFlatValidationError } from "@/plugins/vee-validate";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { getWeekDayName } from "@/utils/date";
import { yen, fillNumber } from "@/utils/format";
import { isUnprocessableEntityError } from "@/plugins/axios";

export default {
  components: {
    ProductItem,
    ProductListDialog,
    GuestPaymentDialog,
    ClientDialog,
    ErrorBox,
    OrderInfo,
    Cart,
    ProgressBar,
    AddressTable,
    TransportDialog,
    ButtonWrapper,
    Button,
  },
  beforeRouteEnter(to, from, next) {
    if (!["cart-guest-order"].includes(from.name)) {
      return next(false);
    }

    next();
  },
  beforeRouteLeave(to, from, next) {
    if (!to.name.match(/^cart-guest-order/)) {
      this.$store.commit("setSessionData", {
        memberToken: null,
        memberId: null,
      });
    }

    next();
  },
  async asyncData({ store }) {
    await Promise.all([store.dispatch("master/fetch")]);
  },
  data() {
    return {
      error: null,
    };
  },
  computed: {
    faChevronRight() {
      return faChevronRight;
    },
    ...mapGetters({
      enumKv: "enum/kv",
      enumValueLabel: "enum/valueLabel",
      cart: "cart/cart",
      guestSihippingAddress: "order/guestSihippingAddress",
      products: "cart/products",
      paymentType: "order/paymentType",
      cardInfo: "order/cardInfo",
      cardMaskedPan: "order/cardMaskedPan",
      maskedSecurityCode: "order/maskedSecurityCode",
      transport: "order/transport",
      message: "order/message",
      cardInputCache: "order/cardInputCache",
      priceInfo: "order/priceInfo",
      errorCodeKv: "order/errorCodeKv",
    }),
    messageContent() {
      return this.message.content;
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
    paymentTypeValudLable() {
      return this.enumValueLabel.order__payment_type || {};
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
        const params = this.$store.getters["order/confirmedGuestFormData"];

        await this.$store.dispatch("order/createGuestOrder", { params });

        this.error = null;
        this.$router.push("/cart/order/complete");
      } catch (error) {
        console.error(error);

        if (isUnprocessableEntityError(error)) {
          const { data } = error.response;
          if (data.code === this.errorCodeKv.StockShortage) {
            this.$store.commit("setSessionData", {
              lastError: {
                title: "購入が完了できませんでした",
                message: "該当商品の在庫がなくなってしまいました",
              },
            });
            this.$router.push({ name: "cart" });
            return;
          }

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
      }
    },
    handleUpdateSihippingAddress() {
      this.$refs.sihippingAddressDialog.show();
    },
    handleSihippingAddressUpdated(client) {
      this.$store.commit("order/setGuestSihippingAddress", client);
    },
    updateTransport() {
      this.$refs.updateTransportDialog.show({
        inputs: this.transport,
      });
    },
    updatePayment() {
      this.$refs.paymentDialog.show({
        cardInfo: this.cardInfo,
        cardInputCache: this.cardInputCache,
      });
    },
    updateProductList() {
      this.$refs.productListDialog.show();
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
