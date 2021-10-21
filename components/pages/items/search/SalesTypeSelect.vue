<template>
  <div class="wrapper">
    <div class="columns is-mobile">
      <div
        v-for="option in options"
        :key="option.id"
        class="column is-half-mobile is-one-third-tablet"
      >
        <Checkbox
          :id="`sales-type-${option.id}`"
          v-model="inputs[option.id]"
          :text="option.name"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Checkbox from "@/components/atoms/Checkbox";

export default {
  name: "SalesTypeSelect",
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
    options() {
      return this.$store.getters["master/salesTypes"];
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
