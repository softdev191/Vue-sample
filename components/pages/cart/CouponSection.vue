<template>
  <div class="coupon-component">
    <CouponSectionSp
      :immediate-mode="immediateMode"
      :use-coupon-ids="useCouponIds"
      :disabled="disabled"
      @error="(error) => $emit('error', error)"
      @update="(value) => $emit('update', value)"
    />
  </div>
</template>

<script>
import CouponSectionSp from "@/components/pages/cart/CouponSectionSp";

export default {
  components: {
    CouponSectionSp,
  },
  props: {
    /**
     * チェックボックス選択後に即時反映するか。
     * falseの場合、`update` イベントを発行する。
     */
    immediateMode: {
      type: Boolean,
      default: true,
    },
    useCouponIds: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
