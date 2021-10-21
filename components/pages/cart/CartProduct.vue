<template>
  <div v-if="product" class="product-item">
    <div class="product-row">
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
    </div>
    <div class="product-row">
      <div class="product-image-wrapper">
        <img :src="product.image_url" alt="" />
      </div>
      <div class="product-info-wrapper">
        <p v-if="isReserved" class="product-pre-order">予約商品</p>
        <p v-if="isBackOrdered" class="product-pre-order">お取り寄せ</p>
        <p class="product-brand">{{ product.brand }}</p>
        <p class="product-title">{{ product.title }}</p>
        <p class="product-uuid">{{ product.uuid }}</p>
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
      </div>
      <div v-if="disabledItem" class="item-error">
        こちらの商品はご利用になれません。
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export const BACK_ORDER_NOTE_THRESHOLD = 60;

export default {
  props: {
    product: {
      type: Object,
      default: undefined,
    },
    disabledItem: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      BACK_ORDER_NOTE_THRESHOLD,
    };
  },
  computed: {
    ...mapState({
      isReserved(state, getters) {
        return getters["cart/isReserved"];
      },
      isBackOrdered(state, getters) {
        return getters["cart/isBackOrdered"];
      },
    }),
  },
};
</script>

<style lang="scss" scoped>
.product-item {
  display: block !important;
  padding: 15px 0;
  .info {
    font-size: 10px;
    color: $error;
    @include desktop {
      text-align: left;
      margin-bottom: 10px;
    }
    @include touch {
      margin-top: 10px;
      text-align: center;
    }
  }
  .extra-info {
    font-size: 10px;
    span {
      color: $error;
    }
  }
  > .product-row {
    width: 100%;
  }
  > .product-image-wrapper {
    width: 120px;
    margin-right: 15px;
  }
  .item-error {
    color: $error;
    font-size: 12px;
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
    }
    > .product-arrival-date {
      font-size: 10px;
    }
    > .product-cost {
      font-size: 14px;
      font-weight: 600;
      margin: 6px 0 10px;
    }
    > .product-purchase {
      display: flex;
      justify-content: space-between;
      align-items: center;
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
</style>
