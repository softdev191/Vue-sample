<template>
  <NuxtLink :to="to" class="ymdy-btn" :disabled="disabled" :class="css">
    <slot />
  </NuxtLink>
</template>

<script>
export const THEME_LIGHT = "light";
export const THEME_DARK = "dark";
export const THEME_GRAY = "gray";
export const THEME_DISABLED = "disabled";

export default {
  components: {},
  emits: ["click"],
  props: {
    to: {
      type: String,
      required: true,
    },
    /**
     * Style
     * light/dark/gray
     */
    theme: {
      type: String,
      default: THEME_LIGHT,
      validate(value) {
        return [THEME_LIGHT, THEME_DARK, THEME_GRAY, THEME_DISABLED].includes(
          value
        );
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    css() {
      if (this.disabled) {
        return THEME_DISABLED;
      }
      const css = [this.theme];
      return css;
    },
  },
};
</script>

<style lang="scss" scoped>
.ymdy-btn {
  &.light {
    border: 1px solid #000;
    background-color: #fff;
    color: #000;
    &:hover {
      color: #fff;
      background-color: #6c6c6c;
      border: 1px solid #6c6c6c;
    }
  }
  &.dark {
    border: 1px solid #6c6c6c;
    background-color: #6c6c6c;
    color: #fff;
    &:hover {
      color: #000;
      background-color: #fff;
      border: 1px solid #000;
    }
  }
  &.gray {
    border: 1px solid #000;
    background-color: #dbdbdb;
    color: #000;
    &:hover {
      color: #000;
      background-color: #505050;
      border: 1px solid #6c6c6c;
    }
  }
  &.disabled {
    border: 0;
    background-color: #dbdbdb;
    color: #707070;
    opacity: 1;
  }
}
</style>
