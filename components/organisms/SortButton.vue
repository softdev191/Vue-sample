<template>
  <div class="light">
    <div class="columns is-mobile is-centered">
      <div class="column has-text-centered">
        <Button theme="dark" class="s-button" @click="handleClick"
          >並び替える</Button
        >
      </div>
    </div>
  </div>
</template>

<script>
import Button from "@/components/atoms/Button";

export default {
  name: "SortButton",
  emits: ["click"],
  components: {
    Button,
  },
  methods: {
    handleClick(event) {
      this.$emit("click", event);
    },
  },
};
</script>

<style lang="scss" scoped>
.s-button {
  width: 54%;
  margin-left: auto;
  margin-right: auto;
}
</style>
