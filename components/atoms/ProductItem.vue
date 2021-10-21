<template>
  <div :class="{ 'expired-item': product.lapsed }">
    <ErrorBox v-if="error" :title="error.title" class="mb10">
      {{ error.message }}
    </ErrorBox>
    <div class="product-item">
      <div class="product-wrapper">
        <nuxt-link
          v-if="linkToItem"
          class="product-image-wrapper"
          :to="{
            name: 'items-detail-product_number',
            params: { product_number: product.product_number },
          }"
        >
          <img :src="product.image_url" alt="" />
        </nuxt-link>
        <div v-else class="product-image-wrapper">
          <img :src="product.image_url" alt="" />
        </div>
        <div class="product-info-wrapper">
          <p v-if="isReserved" class="product-pre-order">予約商品</p>
          <p v-if="isBackOrdered" class="product-pre-order">お取り寄せ</p>
          <p class="product-brand">{{ product.brand }}</p>
          <p class="product-title">{{ product.title }}</p>
          <p class="product-uuid">{{ product.product_number }}</p>
          <p class="product-color">カラー：{{ product.color }}</p>
          <p class="product-size">サイズ：{{ product.size }}</p>
          <p
            v-if="
              product.is_reservation &&
              product.applied_reservation.expected_arrival_date
            "
            class="product-arrival-date"
          >
            お届け予定：{{ product.applied_reservation.expected_arrival_date }}
          </p>
          <p class="product-cost" :class="{ right: !linkToItem }">
            <small
              v-if="product.cart_original_price > product.price_before_order"
              class="original-price"
              ><s>{{ yen(product.retail_price) }}(税込)</s></small
            >
            <span class="sale-price"
              >{{ yen(product.price_before_order) }}(税込)</span
            >
          </p>
          <div class="product-purchase">
            <div class="product-count">
              <template v-if="hasChange && !isReserved && !isBackOrdered">
                <label class="product-count-label">数量：</label>
                <Spiner v-if="changePending" :size="3" />
                <SelectField
                  v-else
                  :value="product.count"
                  wrapper-class="form-select-wrapper"
                  select-class="form-control form-select"
                  select-wrapper-class=""
                  rules="required|min_value:1"
                  name="expiry-month"
                  valid-name="数量"
                  :disabled="product.lapsed"
                  @input="(value) => changeCount(product, value)"
                >
                  <template #options>
                    <option
                      v-for="(count, countIndex) in counts()"
                      :key="countIndex"
                      :value="count"
                    >
                      {{ count }}
                    </option>
                  </template>
                </SelectField>
              </template>
            </div>
            <Spiner v-if="removePending" :size="3" />
            <div
              v-else-if="hasChange"
              class="product-remove"
              @click="removeItem(product)"
            >
              削除
              <CloseIconSvg />
            </div>
          </div>
          <div v-if="disabledItem" class="item-error">
            こちらの商品はご利用になれません。
          </div>
        </div>
      </div>
      <div v-if="product.lapsed" class="expired-wrapper">
        <div class="expired-message">
          <p>{{ getLapsedItemText(product) }}</p>
        </div>
        <ButtonWrapper theme="flex">
          <Button theme="light" @click="remove(product)">表示を消す</Button>
          <Button theme="light" @click="restore(product)">
            もう一度カートに入れる
          </Button>
        </ButtonWrapper>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { yen } from "@/utils/format";
import { extractFlatValidationError } from "@/plugins/vee-validate";
import SelectField from "@/components/atoms/SelectField";
import CloseIconSvg from "@/assets/images/icons/close-icon.svg";
import ErrorBox from "@/components/atoms/ErrorBox";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";
import { isUnprocessableEntityError } from "@/plugins/axios";
import Spiner from "~/components/atoms/loading/Spiner";

const MIN_ITEM_COUNT = 1;
const MAX_ITEM_COUNT = 30;

export default {
  emits: ["error"],
  components: {
    SelectField,
    CloseIconSvg,
    ErrorBox,
    ButtonWrapper,
    Button,
    Spiner,
  },
  props: {
    product: {
      type: Object,
      default: undefined,
    },
    hasChange: {
      type: Boolean,
      default: false,
    },
    disabledItem: {
      type: Boolean,
      default: false,
    },
    linkToItem: {
      type: Boolean,
      default: false,
    },
    paymentType: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      error: null,
      changePending: false,
      removePending: false,
      restorePending: false,
    };
  },
  computed: {
    ...mapGetters({
      cart: "cart/cart",
      isReserved: "cart/isReserved",
      isBackOrdered: "cart/isBackOrdered",
      cartItemInvalidReasonKv: "cart/cartItemInvalidReasonKv",
      errorCodeKv: "enum/errorCodeKv",
    }),
  },
  methods: {
    yen(...args) {
      return yen(...args);
    },
    initError() {
      this.error = null;
    },
    getLapsedItemText(product) {
      if (product.expired) {
        return "カートの有効時間が切れたため、カートから削除されました。";
      }

      switch (product.invalid_reason) {
        case this.cartItemInvalidReasonKv.LapsedReservation:
          return "予約可能期間を過ぎたため、カートから削除されました。";
      }
    },
    async changeCount(product, value) {
      try {
        this.changePending = true;
        const count = Number(value);

        await this.$store.dispatch("cart/updateItem", {
          cartItemId: product.cart_item_id,
          cartId: this.cart.id,
          params: { count, payment_type: this.paymentType },
        });

        this.initError();
      } catch (error) {
        console.error(error);
        const messages = extractFlatValidationError(error);
        this.error = {
          title: "入力エラー",
          message: messages[0],
        };
      } finally {
        this.resetPending();
      }
    },
    async restore(product) {
      try {
        this.restorePending = true;
        await this.$store.dispatch("cart/restoreItem", {
          cartItemId: product.cart_item_id,
          cartId: this.cart.id,
          params: { payment_type: this.paymentType },
        });
        this.initError();
      } catch (error) {
        console.error(error);

        if (isUnprocessableEntityError(error)) {
          const { code } = error.response.data;

          if (code === this.errorCodeKv.EcStockShortageButAvailableBackOrder) {
            this.$emit("suggestBackOrder", product);
            return;
          }

          if (code === this.errorCodeKv.StockShortage) {
            this.$store.commit("cart/removeProduct", product.cart_item_id);
            const messages = extractFlatValidationError(error);
            this.$emit("error", {
              title: "入力エラー",
              message: messages[0],
            });
            return;
          }
        }

        const messages = extractFlatValidationError(error);
        this.error = {
          title: "入力エラー",
          message: messages[0],
        };
      } finally {
        this.resetPending();
      }
    },
    async remove(product) {
      try {
        this.removePending = true;
        await this.$store.dispatch("cart/removeItem", {
          cartItemId: product.cart_item_id,
          cartId: this.cart.id,
          params: { payment_type: this.paymentType },
        });
        this.initError();
      } catch (error) {
        console.error(error);
        const messages = extractFlatValidationError(error);
        this.error = {
          title: "入力エラー",
          message: messages[0],
        };
      } finally {
        this.resetPending();
      }
    },
    async removeItem(product) {
      await this.remove(product);
    },
    counts() {
      const counts = [];
      for (let i = MIN_ITEM_COUNT; i <= MAX_ITEM_COUNT; i++) {
        counts.push(i);
      }
      return counts;
    },
    resetPending() {
      this.changePending = false;
      this.removePending = false;
      this.restorePending = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.product-item {
  display: block;
  padding: 15px 0;
  margin: 0 10px;
  .product-wrapper {
    display: flex;
    > .product-image-wrapper {
      width: 120px;
      margin-right: 10px;
    }
    > .product-info-wrapper {
      .item-error {
        color: $error;
        font-size: 12px;
      }

      flex: 1;
      line-height: 1.4;
      > .product-pre-order {
        color: #cf86a1;
        font-size: 10px;
        margin-bottom: 6px;
      }
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
      }
      > .product-arrival-date {
        font-size: 10px;
      }
      > .product-cost {
        font-size: 14px;
        font-weight: 600;
        margin: 6px 0 10px;
        .original-price {
          color: #6c6c6c;
          margin-right: 5px;
        }
      }
      > .right {
        font-size: 12px;
        text-align: right;
        font-weight: normal;
      }
      > .product-purchase {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .form-select-wrapper {
          display: inline-block;
        }
        .form-input-number-wrapper {
          display: inline-block;
          max-width: 72px;
          input {
            font-size: 10px;
          }
        }
        .product-count {
          font-size: 10px;
        }
        .product-remove {
          font-size: 12px;
          display: flex;
          align-items: center;
          img {
            margin-left: 5px;
          }
        }
      }
    }
  }
}
.expired-item {
  background-color: #dbdbdb;
  width: 100vw;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  .product-item {
    padding: 15px 0 0 0;
    .expired-wrapper {
      line-height: 1.4;
      margin-top: 10px;
      .expired-message {
        background-color: #b23838;
        color: white;
        font-size: 10px;
        margin-bottom: 10px;
        padding: 5px;
        text-align: center;
        width: 100vw;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
}
</style>
