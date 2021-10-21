<template>
  <a class="delete" @click.prevent="handleClick"></a>
</template>

<script>
export default {
  name: "CancelButton",
  emits: ["click"],
  methods: {
    handleClick() {
      this.$emit("click");
    },
  },
};
</script>

<style lang="scss" scoped>
a.delete {
  background: none;

  &::before {
    background-color: $matterhorn;
    height: 1px;
  }

  &::after {
    background-color: $matterhorn;
    width: 1px;
  }
}
</style>
