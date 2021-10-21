<template>
  <div class="wrapper">
    <div class="columns is-mobile">
      <div
        v-for="brand in storeBrands"
        :key="brand.value"
        class="column is-half-mobile is-one-third-tablet"
      >
        <Checkbox
          :id="`store-brand-${brand.value}`"
          v-model="inputs[brand.value]"
          :text="brand.label"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Checkbox from "@/components/atoms/Checkbox";

export default {
  name: "StoreBrandSelect",
  components: {
    Checkbox,
  },
  props: {
    inputs: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    storeBrands() {
      return this.$store.getters["master/enums"].common__store_brand;
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 24px 2% 0;

  .columns {
    flex-wrap: wrap;

    &::v-deep .checkbox .label {
      border-bottom: 0;
      padding-bottom: 0;
    }
  }
}
</style>
