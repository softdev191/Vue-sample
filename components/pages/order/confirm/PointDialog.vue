<template>
  <BaseDialog
    ref="updatePointDialog"
    title="ポイント利用の編集"
    :has-cancel="false"
    ok-text="更新する"
    :invalid="invalid"
    @ok="onUpdatePoint"
  >
    <ErrorBox v-if="errors" :title="errors.title">
      <ul>
        <li v-for="(msg, index) in errors.messages" :key="index">
          {{ msg }}
        </li>
      </ul>
    </ErrorBox>
    <form v-if="inputs">
      <PointUsageForm
        ref="form"
        :inputs="inputs"
        @update:validation="(flags) => (invalid = flags.invalid)"
      />
    </form>
  </BaseDialog>
</template>

<script>
import { mapGetters } from "vuex";
import BaseDialog from "@/components/atoms/BaseDialog";
import ErrorBox from "@/components/atoms/ErrorBox";
import PointUsageForm from "@/components/pages/order/PointUsageForm";
import { extractFlatValidationError } from "@/plugins/vee-validate";

export default {
  components: {
    BaseDialog,
    PointUsageForm,
    ErrorBox,
  },
  data() {
    return {
      inputs: null,
      cartId: null,
      invalid: true,
      errors: null,
    };
  },
  computed: {
    ...mapGetters({
      pointUsage: "order/pointUsage",
      usePointTypeKv: "order/usePointTypeKv",
      usablePoints: "point/amount",
    }),
  },
  methods: {
    show({ inputs, cartId }) {
      this.inputs = { ...inputs };
      this.invalid = true;
      this.cartId = cartId;
      this.$refs.updatePointDialog.show();
    },
    async onUpdatePoint() {
      if (!(await this.$refs.form.validateForm())) {
        return;
      }

      this.errors = null;
      const usePoint = this.getUsePoint();

      try {
        await this.$store.dispatch("cart/updateUsePoint", {
          cartId: this.cartId,
          params: { use_point: usePoint },
        });
      } catch (error) {
        console.error(error);
        const errorMessages = extractFlatValidationError(error);
        this.errors = {
          title: "ご利用ポイントの変更が出来ませんでした。",
          messages: errorMessages,
        };

        return;
      }

      this.$store.commit("order/setPointUsage", {
        use_point: usePoint,
        use_point_type: this.inputs.use_point_type,
      });
      this.$refs.updatePointDialog.hide();
      this.inputs = null;
      this.cartId = null;
    },

    getUsePoint() {
      const inputs = this.inputs;

      switch (inputs.use_point_type) {
        case this.usePointTypeKv.Part:
          return inputs.use_point;
        case this.usePointTypeKv.All:
          return this.usablePoints;
        default:
          return 0;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.current-point-row {
  font-size: 10px;
  text-align: center;
  .current-point {
    font-size: 16px;
    font-weight: 600;
  }
}
.w160 {
  max-width: 160px;
}
</style>
