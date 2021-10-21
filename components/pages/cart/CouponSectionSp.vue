<template>
  <div class="coupon-component">
    <ErrorBox v-if="error" :title="error.title">
      {{ error.message }}
    </ErrorBox>
    <div class="dropdown-section">
      <Accordion
        :divider="false"
        :max-height="accordionMaxHeight"
        :disabled="disabled"
      >
        <template #title>クーポンの適用</template>
        <template #content>
          <div v-if="uncombinableAvailableCoupons.length">
            <div class="uncombinable-title">通常クーポンの適用 (併用不可)</div>
            <div class="dropdown-section-content uncombinable-section-top">
              <div class="dropdown-section-content-inner">
                <div class="select-coupon">
                  選択してください
                  <fa class="angle-down" :icon="faChevronDown" />
                </div>
              </div>
            </div>
            <div class="dropdown-section-content uncombinable-section">
              <div class="dropdown-section-content-inner">
                <CouponRadio
                  v-for="(coupon, index) in uncombinableAvailableCoupons"
                  :key="index"
                  ref="coupons"
                  :coupon="coupon"
                  :pending="pending[coupon.id]"
                  :disabled="pendingAny"
                  :use-coupon-id-dict="useCouponIdDict"
                  @check="handleCheckUncombinable"
                  @uncheck="handleUncheckUncombinable"
                />
              </div>
            </div>
          </div>
          <div v-if="combinableAvailableCoupons.length">
            <div class="combinable-title">
              スペシャルクーポンの適用 (併用可)
            </div>
            <div class="dropdown-section-content">
              <div class="dropdown-section-content-inner">
                <CouponCheckbox
                  v-for="(coupon, index) in combinableAvailableCoupons"
                  :key="index"
                  ref="coupons"
                  :coupon="coupon"
                  :pending="pending[coupon.id]"
                  :disabled="pendingAny"
                  :use-coupon-id-dict="useCouponIdDict"
                  @check="handleCheckCombinable"
                  @uncheck="handleUncheckCombinable"
                />
              </div>
            </div>
          </div>
          <div
            v-if="
              !uncombinableAvailableCoupons.length &&
              !combinableAvailableCoupons.length
            "
          >
            <div class="no-coupon-title">適用できるクーポンはありません。</div>
          </div>
        </template>
      </Accordion>
    </div>
  </div>
</template>

<script>
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import ErrorBox from "@/components/atoms/ErrorBox";
import Accordion from "@/components/molecules/widget/Accordion";
import CouponCheckbox from "@/components/pages/cart/CouponCheckbox";
import CouponRadio from "@/components/pages/cart/CouponRadio";
import couponSelectMixin from "@/components/pages/cart/mixins/couponSelectMixin";

export default {
  components: {
    ErrorBox,
    Accordion,
    CouponRadio,
    CouponCheckbox,
  },
  mixins: [couponSelectMixin],
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      faChevronDown,
    };
  },
  computed: {
    accordionMaxHeight() {
      return (
        94 *
          (this.uncombinableAvailableCoupons.length +
            this.combinableAvailableCoupons.length) +
        300
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.select-coupon {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  padding: 10px 0 10px 10px;

  .angle-down {
    margin-right: 10px;
  }
}
.uncombinable-title,
.combinable-title,
.no-coupon-title {
  font-size: 14px;
  padding: 16px;
}
.uncombinable-section-top {
  border: solid $middle-gray;
  border-width: 1px 1px 0 1px;
}
.uncombinable-section {
  border: 1px solid $middle-gray;
  margin-bottom: 10px;
}
</style>
