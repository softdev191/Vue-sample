<template>
  <BaseDialog
    ref="updateProductListsDialog"
    title="注文商品の編集"
    :has-cancel="false"
    ok-text="閉じる"
    @ok="hide"
  >
    <template v-if="showDialog">
      <table class="product-table">
        <thead>
          <tr>
            <th>商品情報</th>
            <th class="py16 pc-only">価格</th>
            <th class="py16 pc-only">数量</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in products" :key="index">
            <td>
              <CartProduct
                :product="product"
                :disabled-item="
                  disabledItemDetails[product.item_detail_id] !== undefined
                "
              />
            </td>
            <td>
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
            </td>
            <td>
              <div class="form-select-wrapper">
                <select
                  class="form-control"
                  :value="product.count"
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
              <div class="product-remove" @click="remove(product)">
                削除
                <CloseIconSvg />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="product-list-wrapper">
        <error-box v-if="error" :title="error.title">
          {{ error.message }}
        </error-box>
        <ul class="product-list">
          <li
            v-for="(product, index) in products"
            :key="index"
            class="product-list-item"
          >
            <ProductItem
              :product="product"
              :has-change="true"
              :disabled-item="
                disabledItemDetails[product.item_detail_id] !== undefined
              "
              :payment-type="paymentType"
            ></ProductItem>
            <div class="full-divider"></div>
          </li>
        </ul>
      </div>
    </template>
  </BaseDialog>
</template>

<script>
import { mapGetters } from "vuex";
import CartProduct from "@/components/pages/cart/CartProduct.vue";
import ErrorBox from "@/components/atoms/ErrorBox";
import BaseDialog from "@/components/atoms/BaseDialog";
import { yen } from "@/utils/format";
import ProductItem from "@/components/atoms/ProductItem";
import { extractFlatValidationError } from "@/plugins/vee-validate";
import CloseIconSvg from "@/assets/images/icons/close-icon.svg";

const REMOVE_ITEM_COUNT = 0;
const MIN_ITEM_COUNT = 1;
const MAX_ITEM_COUNT = 30;
export default {
  components: {
    ProductItem,
    CartProduct,
    ErrorBox,
    BaseDialog,
    CloseIconSvg,
  },
  props: {
    paymentType: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      error: null,
      showDialog: false,
    };
  },
  computed: {
    ...mapGetters({
      cart: "cart/cart",
      products: "cart/products",
    }),
    disabledItemDetails() {
      if (!this.cart) {
        return {};
      }

      return this.cart.disabledItemDetails || {};
    },
  },
  methods: {
    yen(...args) {
      return yen(...args);
    },
    show() {
      this.showDialog = true;
      this.$refs.updateProductListsDialog.show();
    },
    hide() {
      this.showDialog = false;
      this.$refs.updateProductListsDialog.hide();
    },
    async changeCount(product, value) {
      try {
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
          params: { count, payment_type: this.paymentType },
        });

        this.error = null;
      } catch (error) {
        const messages = extractFlatValidationError(error);
        this.error = {
          title: "入力エラー",
          message: messages[0],
        };
      }
    },
    async remove(product) {
      try {
        await this.$store.dispatch("cart/removeItem", {
          cartItemId: product.cart_item_id,
          cartId: this.cart.id,
          params: { payment_type: this.paymentType },
        });
        this.error = null;
      } catch (error) {
        const messages = extractFlatValidationError(error);
        this.error = {
          title: "入力エラー",
          message: messages[0],
        };
      }
    },
    counts() {
      const counts = [];
      for (let i = MIN_ITEM_COUNT; i <= MAX_ITEM_COUNT; i++) {
        counts.push(i);
      }
      return counts;
    },
  },
};
</script>

<style lang="scss" scoped>
.product-table {
  width: 100%;
  @include touch {
    display: none;
  }
  th {
    border-bottom: 1px solid $gray;
    padding-top: 8px;
    padding-bottom: 8px;
  }
  td {
    position: relative;
    vertical-align: bottom;
    border-bottom: 1px solid $gray;
  }
  .product-item {
    display: flex;
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
  .product-cost {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 32px;
  }
  .form-input-number-wrapper {
    display: inline-block;
    max-width: 72px;
    margin-bottom: 32px;
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
    right: 0;
    cursor: pointer;
    img {
      margin-left: 5px;
    }
  }
}
.product-list {
  @include desktop {
    display: none;
  }
  .product-item {
    display: flex;
    padding: 15px 0;
    > .product-image-wrapper {
      width: 120px;
      margin-right: 10px;
    }
    > .product-info-wrapper {
      flex: 1;
      line-height: 1.4;
      padding-top: 15px;
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
      > .product-cost {
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 10px;
        .original-price {
          color: #6c6c6c;
          margin-right: 5px;
        }
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
</style>
