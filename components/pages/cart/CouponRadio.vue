<template>
  <div
    class="coupon-item mb10"
    :class="{ checked, pending }"
    @click="handleClickItem"
  >
    <label class="coupon-check-input">
      <label class="form-label-radio" :for="`sp_coupon_${coupon.id}`">
        {{ coupon.name }}
      </label>
    </label>
    <div class="coupon-footer columns is-mobile">
      <div class="coupon-discount-content column is-4">
        {{ discountContent }}
      </div>
      <div class="coupon-limit-date column">
        {{ limitDatetime }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { yen } from "@/utils/format";
import dayjs from "dayjs";

export default {
  name: "Coupon",
  props: {
    coupon: {
      type: Object,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    pending: {
      type: Boolean,
      default: false,
    },
    useCouponIdDict: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      inputKey: 0,
      inputCache: null,
    };
  },
  computed: {
    ...mapGetters({
      couponDiscountTypeKv: "cart/couponDiscountTypeKv",
    }),
    checked() {
      if (this.inputCache !== null) {
        return this.inputCache;
      }

      return (this.useCouponIdDict || {})[this.coupon.id] !== undefined;
    },
    discountContent() {
      const coupon = this.coupon;

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
    limitDatetime() {
      const coupon = this.coupon;

      if (!coupon.end_dt) {
        return "";
      }

      const endDt = dayjs(coupon.end_dt);

      return `期限: ${endDt.format("YYYY/MM/DD HH:mm")}`;
    },
  },
  methods: {
    yen(...args) {
      return yen(...args);
    },
    handleClickItem() {
      if (this.disabled) {
        return;
      }

      const checked = !this.checked;
      this.inputCache = checked;
      this.$emit(checked ? "check" : "uncheck", this.coupon);
    },
    resetChecked() {
      this.inputCache = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.coupon-item {
  padding: 6px 2px 8px 10px;

  &.checked {
    background: #e6e6e6;
  }
  &.pending {
    opacity: 0.5;
  }

  .coupon-check-input {
    display: block;
    margin-bottom: 2px;

    .form-label-radio {
      font-size: 14px;
    }
  }

  .coupon-footer {
    padding-left: 0;

    .coupon-discount-content,
    .coupon-limit-date {
      font-size: 12px;
    }
  }
}
</style>
