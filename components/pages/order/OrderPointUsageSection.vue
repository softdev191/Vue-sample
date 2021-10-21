<template>
  <form>
    <OrderSection :title="title">
      <PointUsageForm
        :inputs="inputs"
        @update:validation="(value) => $emit('update:validation', value)"
      />
    </OrderSection>
  </form>
</template>

<script>
import OrderSection from "@/components/pages/order/OrderSection";
import PointUsageForm from "@/components/pages/order/PointUsageForm";

export default {
  components: {
    OrderSection,
    PointUsageForm,
  },
  props: {
    title: {
      type: String,
      default: "5. ポイント利用",
    },
    inputs: {
      type: Object,
      default: () => ({}),
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
.w175 {
  max-width: 175px;
}
</style>
