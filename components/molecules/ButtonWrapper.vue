<template>
  <div class="buttons-wrapper" :class="[theme, className]">
    <slot />
  </div>
</template>

<script>
export const THEME_NORMAL = "normal"; // 通常幅ボタン一つ
export const THEME_FULL = "full"; // 全幅ボタン
export const THEME_FLEX = "flex"; // 二つ並んだボタン

export default {
  props: {
    theme: {
      type: String,
      default: THEME_NORMAL,
      validate(value) {
        return [THEME_NORMAL, THEME_FULL, THEME_FLEX].includes(value);
      },
    },
    className: {
      type: String,
      default: "",
    },
  },
};
</script>
<style lang="scss" scoped>
.buttons-wrapper {
  margin: 0 auto;
  &.normal {
    width: 64%;
  }
  &.full {
    width: 100%;
  }
  &.flex {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .btn-wrap,
    .ymdy-btn {
      width: 49%;
    }
  }
}
</style>
