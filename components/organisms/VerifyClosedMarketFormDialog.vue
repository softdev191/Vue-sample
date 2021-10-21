<template>
  <BaseDialog
    ref="dialog"
    title="パスワードを入力してください。"
    :has-cancel="false"
    :has-ok="false"
    :has-close-button="false"
    :disable-click-background="true"
    @close="handleClose"
  >
    <VerifyClosedMarketForm
      v-if="isOpen"
      :closed-market-id="closedMarketId"
      @verified="handleVerified"
    />
  </BaseDialog>
</template>

<script>
import BaseDialog from "@/components/atoms/BaseDialog";
import VerifyClosedMarketForm from "@/components/organisms/VerifyClosedMarketForm";

export default {
  name: "VerifyClosedMarketFormDialog",
  components: {
    BaseDialog,
    VerifyClosedMarketForm,
  },
  data() {
    return {
      closedMarketId: null,
      isOpen: false,
    };
  },
  methods: {
    show({ closedMarketId }) {
      this.closedMarketId = closedMarketId;
      this.$refs.dialog.show();
      this.isOpen = true;
    },
    hide() {
      this.closedMarketId = null;
      this.$refs.dialog.hide();
      this.$emit("close");
      this.isOpen = false;
    },
    handleClose() {
      this.closedMarketId = null;
      this.isOpen = false;
    },
    handleVerified() {
      this.hide();
    },
  },
};
</script>

<style lang="scss" scoped>
.my-modal-wrapper {
  &::v-deep .fixed-container {
    max-width: 480px !important;
  }
}
</style>
