<template>
  <div class="coupon-item mb10 columns is-mobile" :class="{ pending }">
    <div class="column is-1">
      <input
        :id="`sp_coupon_${coupon.id}`"
        :key="inputKey"
        v-model="checked"
        class="form-checkbox"
        type="checkbox"
        name="sp_coupon_id"
        :disabled="disabled"
      />
      <label class="form-label" :for="`sp_coupon_${coupon.id}`"></label>
    </div>
    <div class="column coupon-item-info">
      <label class="coupon-check-input">
        <label class="form-label" :for="`sp_coupon_${coupon.id}`">
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
        <span class="q-icon" @click="handleClickDetail(coupon)">
          <img src="@/assets/images/info-icon.png" alt="" />
        </span>
      </div>
    </div>
    <CouponDetailDialog ref="couponDetailDialog" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { yen } from "@/utils/format";
import dayjs from "dayjs";
import CouponDetailDialog from "@/components/organisms/dialog/CouponDetail";

export default {
  name: "Coupon",
  components: {
    CouponDetailDialog,
  },
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
    checked: {
      get() {
        if (this.inputCache !== null) {
          return this.inputCache;
        }
        return (this.useCouponIdDict || {})[this.coupon.id] !== undefined;
      },
      set(value) {
        if (this.disabled) {
          return;
        }

        this.inputCache = value;
        this.handleInput(value);
      },
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
    handleInput(checked) {
      this.$emit(checked ? "check" : "uncheck", this.coupon);
    },
    resetChecked() {
      this.inputCache = null;
      this.inputKey++;
    },
    handleClickDetail() {
      this.$refs.couponDetailDialog.open({
        coupon: this.coupon,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.coupon-item {
  &.pending {
    opacity: 0.5;
  }

  .coupon-item-info {
    background: #f1f1f1;
    padding-top: 4px;
    padding-bottom: 4px;
    padding-right: 16px;
    margin-top: 4px;
    margin-bottom: 4px;

    .coupon-check-input {
      display: block;
      margin-bottom: 2px;
      padding-bottom: 2px;
      border-bottom: 1px solid #e1e1e1;

      .form-label {
        font-size: 14px;
      }
    }

    .coupon-footer {
      position: relative;
      padding-top: 2px;

      .coupon-discount-content,
      .coupon-limit-date {
        font-size: 12px;
      }
      .q-icon {
        position: absolute;
        right: 5px;
        bottom: 12px;
        display: block;
        width: 16px;
        height: 16px;
      }
    }
  }
}
</style>
