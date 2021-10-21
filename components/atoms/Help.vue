<template>
  <NuxtLink :to="link" class="help-component">
    <InfoIcon />
    <span class="text">{{ text }}</span>
  </NuxtLink>
</template>

<script>
import InfoIcon from "@/assets/images/icons/info-icon.svg";
export default {
  components: {
    InfoIcon,
  },
  props: {
    text: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      default: "",
    },
  },
  methods: {
    onHelp() {
      this.$emit("help");
    },
  },
};
</script>

<style lang="scss" scoped>
.help-component {
  display: inline-flex;
  align-items: center;
  > svg {
    margin-right: 6px;
  }
  > .text {
    font-size: 10px;
    color: $black;
  }
}
</style>
