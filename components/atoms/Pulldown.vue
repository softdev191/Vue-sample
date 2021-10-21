<template>
  <select v-model="innerValue" class="select">
    <option v-for="(option, index) in options" :key="index" :value="option.id">
      {{ option.text }}
    </option>
  </select>
</template>

<script>
export default {
  name: "PulldownNavi",
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    value: {
      type: [Number, String],
      default: null,
    },
  },
  computed: {
    innerValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.select {
  border: none;
  border-bottom: 1px solid #000;
  background-color: #fff;
}
</style>
