<template>
  <BaseDialog
    ref="dialog"
    title="クーポンを変更する"
    :has-cancel="false"
    ok-text="変更する"
    @ok="handleEnter"
  >
    <ErrorBox v-if="error" class="pc-only" :title="error.title">
      {{ error.message }}
    </ErrorBox>
    <CouponSection
      v-if="useCouponIds"
      :use-coupon-ids="useCouponIds"
      :immediate-mode="false"
      :disabled="true"
      @error="(error) => handleError(error)"
      @update="(value) => handleUpdate(value)"
    />
  </BaseDialog>
</template>

<script>
import BaseDialog from "@/components/atoms/BaseDialog";
import CouponSection from "@/components/pages/cart/CouponSection";
import { extractFlatValidationError } from "@/plugins/vee-validate";
import ErrorBox from "@/components/atoms/ErrorBox";

export default {
  name: "CouponDialog",
  components: {
    CouponSection,
    BaseDialog,
    ErrorBox,
  },
  data() {
    return {
      useCouponIds: null,
      paymentType: null,
      error: null,
    };
  },
  methods: {
    show({ useCouponIds, paymentType }) {
      this.useCouponIds = [...useCouponIds];
      this.paymentType = paymentType;
      this.$refs.dialog.show();
    },
    hide() {
      this.$refs.dialog.hide();
      this.useCouponIds = null;
      this.paymentType = null;
      this.error = null;
    },
    handleUpdate(useCouponIds) {
      this.useCouponIds = [...useCouponIds];
    },
    async handleEnter() {
      try {
        const useCouponIds = this.useCouponIds;
        await this.$store.dispatch("cart/changeUseCoupons", {
          useCouponIds,
          params: { payment_type: this.paymentType },
        });
        this.hide();
      } catch (error) {
        const messages = extractFlatValidationError(error);

        this.error = {
          title: "適用クーポンの更新ができませんでした。",
          message: messages[0],
        };
      }
    },
    handleError(error) {
      this.error = error;
    },
  },
};
</script>
