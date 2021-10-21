<template>
  <div class="cart-component-wrapper">
    <div class="cart-component" @click="show">
      <img src="@/assets/images/cart-icon.png" alt="" />
      <span class="cart-look">カートを見る</span>
      <span class="cart-price">{{ yen(totalCost) }}</span>
      <fa :icon="faChevronDown" />
    </div>
    <div class="cart-modal-wrapper" :class="{ 'is-open': isShow }">
      <div class="cart-modal-mask" @click="out"></div>
      <div class="fixed-container">
        <div class="cart-modal-content">
          <div class="cart-modal-header">
            <div class="cart-modal-title">注文内容</div>
          </div>
          <div class="cart-modal-body">
            <div class="cart-section-content">
              <div class="order-info-wrapper">
                <p class="order-info-row">
                  <span class="order-info-label">商品合計</span>
                  <span class="order-info-value">{{
                    yen(orderInfo.products_cost)
                  }}</span>
                </p>

                <p v-if="orderInfo.campaign_reduce > 0" class="order-info-row">
                  <span class="order-info-label">キャンペーン割引</span>
                  <span class="order-info-value">
                    -{{ yen(orderInfo.campaign_reduce) }}
                  </span>
                </p>
                <p v-if="orderInfo.coupon_discount > 0" class="order-info-row">
                  <span class="order-info-label">クーポン割引</span>
                  <span class="order-info-value">
                    -{{ yen(orderInfo.coupon_discount) }}
                  </span>
                </p>
                <p
                  v-if="orderInfo.employee_discount > 0"
                  class="order-info-row"
                >
                  <span class="order-info-label">社員割引</span>
                  <span class="order-info-value">
                    -{{ yen(orderInfo.employee_discount) }}
                  </span>
                </p>
                <p class="order-info-row">
                  <span class="order-info-label">送料</span>
                  <span class="order-info-value">{{
                    yen(orderInfo.transfer_cost)
                  }}</span>
                </p>

                <div class="full-divider"></div>
                <div class="order-sum-row">
                  <div class="order-sum-label">
                    <span class="big">合計</span>
                    <span class="small">（税込）</span>
                  </div>
                  <div class="order-sum-value">{{ yen(totalCost) }}</div>
                </div>
                <div class="full-divider"></div>
              </div>
              <div v-if="products" class="product-list-wrapper">
                <div class="product-list-header">
                  <label class="count-label">
                    カートの中身：計 {{ productCount }}点
                  </label>
                  <nuxt-link to="/cart" type="button" class="btn sm edit">
                    編集する <span class="angle-right"></span>
                  </nuxt-link>
                </div>
                <ul class="product-list">
                  <li
                    v-for="(product, index) in products"
                    :key="index"
                    class="product-list-item"
                  >
                    <ProductItem
                      :product="product"
                      :has-change="false"
                      :payment-type="paymentType"
                    ></ProductItem>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="cart-modal-footer">
            <div class="cart-modal-actions">
              <ButtonWrapper theme="full">
                <Button theme="light" @click="cancel">閉じる</Button>
              </ButtonWrapper>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { yen } from "@/utils/format";
import ProductItem from "@/components/atoms/ProductItem";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";

export default {
  components: {
    ProductItem,
    ButtonWrapper,
    Button,
  },
  props: {
    paymentType: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      isShow: false,
    };
  },
  computed: {
    ...mapGetters({
      orderInfo: "cart/orderInfo",
      totalCost: "cart/totalCost",
      productCount: "cart/productCount",
      products: "cart/products",
    }),
    faChevronDown() {
      return faChevronDown;
    },
  },
  methods: {
    yen(...args) {
      return yen(...args);
    },
    show() {
      this.isShow = true;
    },
    hide() {
      this.isShow = false;
    },
    out() {
      this.isShow = false;
    },
    cancel() {
      this.isShow = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.btn {
  &.sm {
    display: inline-block;
    font-size: 10px;
    line-height: 10px;
    width: 100px;
    padding: 10px;
  }
  &.edit {
    color: $black;
    border: none;
    font-size: 12px;
    text-align: end;
    outline: none;
  }
  span.angle-right {
    border: solid black;
    border-width: 0 1px 1px 0;
    display: inline-block;
    position: absolute;
    padding: 3.6px;
    margin-top: 1px;
    margin-left: 2px;
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
  }
}
.cart-component-wrapper {
  text-align: right;
}
.cart-component {
  font-size: 12px;
  line-height: 22px;
  display: inline-flex;
  align-items: center;
  padding: 2px 0;
  border-bottom: 1px solid #707070;
  img {
    margin-bottom: 4px;
    margin-right: 10px;
  }
  .cart-look {
    font-size: 10px;
    margin-right: 6px;
  }
  .cart-price {
    font-size: 14px;
    font-weight: 600;
    margin-right: 10px;
  }
}
.cart-modal-wrapper {
  transition-duration: 0.2s;
  z-index: 100;
  position: fixed;
  top: 100px;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  opacity: 0;
  pointer-events: none;
  text-align: left;
  .cart-modal-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9;
  }
  .cart-modal-content {
    position: relative;
    min-width: 355px;
    max-height: calc(100vh - 200px);
    z-index: 10;
    background-color: #fff;
    padding: 20px 10px;
    transform: translateY(20px);
    transition: 0.4s;
    overflow: auto;
    .cart-modal-header {
      font-weight: bold;
      color: $black;
      font-size: 14px;
      .cart-modal-title {
        color: $black;
        font-size: 14px;
        line-height: 1;
      }
      .cart-modal-close {
        position: absolute;
        top: 20px;
        right: 10px;
        width: 12px;
        height: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 12px;
      }
    }
    .cart-modal-body {
      color: $black;
      font-size: 12px;
      line-height: 22px;
      padding: 20px 0;
    }
    .cart-modal-footer {
      > .cart-modal-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        > .btn {
          &.ok {
            border: 1px solid $black;
          }
          + .btn {
            margin-left: 10px;
          }
        }
      }
    }
  }
  &.is-open {
    opacity: 1;
    pointer-events: all;
    .cart-modal-content {
      transform: none;
    }
  }
}

.order-info-wrapper {
  .order-info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
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
  .product-list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 14px 0;
    .count-label {
      font-size: 14px;
      font-weight: 600;
    }
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
</style>
