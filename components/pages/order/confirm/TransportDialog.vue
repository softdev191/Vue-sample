<template>
  <BaseDialog
    ref="updateTransportDialog"
    title="配送会社と時間の編集"
    :has-cancel="false"
    ok-text="更新する"
    :invalid="invalid"
    @ok="onUpdateTransport"
  >
    <form v-if="inputs">
      <DeliveryOptionForm
        ref="form"
        :inputs="inputs"
        @update:validation="(flags) => (invalid = flags.invalid)"
      />
    </form>
  </BaseDialog>
</template>

<script>
import BaseDialog from "@/components/atoms/BaseDialog";
import DeliveryOptionForm from "@/components/pages/order/DeliveryOptionForm";

export default {
  components: {
    BaseDialog,
    DeliveryOptionForm,
  },
  data() {
    return {
      hasTransportTime: true,
      inputs: null,
      invalid: true,
    };
  },
  methods: {
    show({ inputs }) {
      this.inputs = { ...inputs };
      this.invalid = true;
      this.$refs.updateTransportDialog.show();
    },
    async onUpdateTransport() {
      if (!(await this.$refs.form.validateForm())) {
        return;
      }

      const inputs = { ...this.inputs };

      if (!inputs.delivery_has_time) {
        inputs.delivery_hope_date = null;
        inputs.delivery_hope_time = null;
      }

      this.$store.commit("order/setTransport", inputs);
      this.$refs.updateTransportDialog.hide();
      this.inputs = null;
    },
  },
};
</script>
