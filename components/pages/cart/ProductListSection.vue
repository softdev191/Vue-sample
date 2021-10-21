<template>
  <div class="product-list-wrapper">
    <error-box v-if="error" :title="error.title">
      {{ error.message }}
    </error-box>
    <!-- PC -->
    <div class="product-list-pc">
      <div class="product-title">
        <div class="product-info">
          <p>商品情報</p>
        </div>
        <div class="product-price">
          <p>価格</p>
        </div>
        <div class="product-count">
          <p>数量</p>
        </div>
      </div>
      <div class="product-body">
        <div v-if="products.length === 0" class="mt-6 mb-6">
          カートの中身はありません
        </div>
        <div
          v-for="(product, index) in products"
          :key="index"
          :class="{ 'expired-pc-item': product.lapsed }"
        >
          <div class="product-item">
            <div class="product-info product-col">
              <CartProduct :product="product" />
            </div>
            <div class="product-price product-col">
              <p
                v-if="product.cart_original_price > product.price_before_order"
                class="product-cost"
              >
                <small class="original-price"
                  ><s>{{ yen(product.cart_original_price) }}(税込)</s></small
                >
                <span class="sale-price"
                  >{{ yen(product.price_before_order) }}(税込)</span
                >
              </p>
              <p v-else class="product-cost">
                {{ yen(product.price_before_order) }}(税込)
              </p>
            </div>
            <div class="product-count product-col">
              <div class="form-select-wrapper">
                <Spiner v-if="changePending" :size="3" />
                <select
                  v-else-if="!isReserved && !isBackOrdered"
                  class="form-control"
                  :value="product.count"
                  :disabled="product.lapsed"
                  @change="changeCount(product, $event.target.value)"
                >
                  <option
                    v-for="(count, countIndex) in counts()"
                    :key="countIndex"
                    :value="count"
                  >
                    {{ count }}
                  </option>
                </select>
              </div>
              <Spiner v-if="deletePending" :size="3" />
              <div v-else class="product-remove" @click="removeItem(product)">
                削除
                <CloseIconSvg />
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
    </div>
    <!-- SP -->
    <ul class="product-list">
      <li v-if="products.length === 0" class="mt-4 mb-4">
        カートの中身はありません
      </li>
      <li
        v-for="(product, index) in products"
        :key="index"
        class="product-list-item"
      >
        <p v-if="!isBackOrdered && !product.lapsed" class="info">
          この商品はあと{{ product.valid_time }}分在庫確保されます。
        </p>
        <p
          v-if="isBackOrdered && product.valid_time < BACK_ORDER_NOTE_THRESHOLD"
          class="info"
        >
          取り寄せについての在庫確保は商品購入後に確保します。ご注意ください。
        </p>
        <p v-if="isReserved" class="extra-info">
          この商品は
          <span>「予約商品」</span>
          のため、通常商品と同時に注文することはできません。
        </p>
        <p v-if="isBackOrdered" class="extra-info">
          この商品は
          <span>「お取り寄せ商品」</span>
          のため、1点でご注文ください。 <br />
          複数点での注文はできかねます。
        </p>
        <ProductItem
          :product="product"
          :has-change="true"
          :link-to-item="true"
          @suggestBackOrder="
            (item) => showSuggestBackOrderDialog(item.product_number)
          "
          @error="(internalError) => (error = internalError)"
        ></ProductItem>
        <div class="full-divider"></div>
      </li>
    </ul>
    <BaseDialog
      ref="suggestBackOrderDialog"
      ok-text="商品ページに移動する"
      @ok="events.emit('suggestBackOrderDialogOk')"
      @cancel="events.emit('suggestBackOrderDialogCancel')"
      @close="events.emit('suggestBackOrderDialogCancel')"
      @out="events.emit('suggestBackOrderDialogCancel')"
    >
      取り寄せ販売可能ですがどうですか？
    </BaseDialog>
  </div>
</template>

<script>
import EventEmitter from "events";
import { mapGetters } from "vuex";
import CartProduct, {
  BACK_ORDER_NOTE_THRESHOLD,
} from "@/components/pages/cart/CartProduct.vue";
import ErrorBox from "@/components/atoms/ErrorBox";
import { yen } from "@/utils/format";
import ProductItem from "@/components/atoms/ProductItem";
import { extractFlatValidationError } from "@/plugins/vee-validate";
import CloseIconSvg from "@/assets/images/icons/close-icon.svg";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";
import BaseDialog from "@/components/atoms/BaseDialog";
import { isUnprocessableEntityError } from "@/plugins/axios";
import Spiner from "~/components/atoms/loading/Spiner";

const REMOVE_ITEM_COUNT = 0;
const MIN_ITEM_COUNT = 1;
const MAX_ITEM_COUNT = 30;

export default {
  components: {
    ProductItem,
    CartProduct,
    ErrorBox,
    CloseIconSvg,
    ButtonWrapper,
    Button,
    BaseDialog,
    Spiner,
  },
  data() {
    return {
      error: null,
      events: new EventEmitter(),
      BACK_ORDER_NOTE_THRESHOLD,
      changePending: false,
      deletePending: false,
      restorePending: false,
    };
  },
  computed: {
    ...mapGetters({
      cart: "cart/cart",
      products: "cart/products",
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
        if (count <= REMOVE_ITEM_COUNT) {
          this.error = {
            title: "入力エラー",
            message: "数量は１より大きい値でなければなりません",
          };
          return;
        }

        await this.$store.dispatch("cart/updateItem", {
          cartItemId: product.cart_item_id,
          cartId: this.cart.id,
          params: { count },
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
        });
        this.initError();
      } catch (error) {
        console.error(error);
        if (isUnprocessableEntityError(error)) {
          const { code } = error.response.data;

          if (code === this.errorCodeKv.EcStockShortageButAvailableBackOrder) {
            this.showSuggestBackOrderDialog(product.product_number);
            return;
          }

          if (code === this.errorCodeKv.StockShortage) {
            this.$store.commit("cart/removeProduct", product.cart_item_id);
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
        this.deletePending = true;
        await this.$store.dispatch("cart/removeItem", {
          cartItemId: product.cart_item_id,
          cartId: this.cart.id,
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
    async showSuggestBackOrderDialog(productNumber) {
      this.$refs.suggestBackOrderDialog.show();

      const result = await new Promise((resolve) => {
        this.events.once("suggestBackOrderDialogOk", () => resolve(true));
        this.events.once("suggestBackOrderDialogCancel", () => resolve(false));
      });

      if (result) {
        this.$router.push({
          name: "items-detail-product_number",
          params: {
            product_number: productNumber,
          },
        });
      }

      this.$refs.suggestBackOrderDialog.hide();
    },
    resetPending() {
      this.changePending = false;
      this.deletePending = false;
      this.restorePending = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.product-list-pc {
  width: 100%;
  @include touch {
    display: none;
  }
  .product-info {
    width: 52%;
  }
  .product-price {
    width: 37%;
  }
  .product-count {
    width: 11%;
  }
  .product-title {
    border-bottom: 1px solid $gray;
    padding-bottom: 8px;
    font-weight: bold;
    display: flex;
  }
  .product-body {
    width: 100%;
    .product-item {
      display: flex;
      .product-col {
        position: relative;
        vertical-align: bottom;
      }
      .product-cost {
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 32px;
        .original-price {
          color: #6c6c6c;
          margin-right: 5px;
        }
        position: absolute;
        bottom: 0;
      }
      > .product-image-wrapper {
        width: 120px;
        margin-right: 10px;
      }
      > .product-info-wrapper {
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
          margin-bottom: 6px;
        }
      }
    }
    .form-select-wrapper {
      display: inline-block;
      max-width: 72px;
      margin-bottom: 32px;
      position: absolute;
      bottom: 0;
      input {
        font-size: 12px;
      }
    }
    .product-remove {
      font-size: 12px;
      display: flex;
      align-items: center;
      position: absolute;
      top: 15px;
      left: 0;
      cursor: pointer;
      img {
        margin-left: 5px;
      }
    }
  }
  .expired-pc-item {
    background-color: #dbdbdb;
    width: 100%;
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
        width: 100%;
      }
    }
  }
}
.product-list {
  @include desktop {
    display: none;
  }
  .info {
    font-size: 10px;
    color: $error;
    margin-top: 10px;
    text-align: center;
  }
  .extra-info {
    font-size: 10px;
    text-align: center;
    letter-spacing: -0.5px;
    span {
      color: $error;
      font-weight: bold !important;
    }
  }
}
</style>
