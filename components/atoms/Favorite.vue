<template>
  <svg
    class="favorite selected"
    :class="{ added: isAdded }"
    xmlns="http://www.w3.org/2000/svg"
    width="16.287"
    height="17.166"
    viewBox="0 0 16.287 17.166"
    @click.prevent="$emit('click')"
  >
    <path
      id="Icon_feather-heart"
      class="svg"
      :class="css"
      data-name="Icon feather-heart"
      d="M17.053,6.171c-1.867-1.606-5.471-2.279-6.789,2.641C8.935,3.851,5.516,4.319,3.475,6.171s-1.65,5.376,0,7.426l.814,1.012,5.975,7.426,5.975-7.426.814-1.012c1.651-2.05,1.867-5.821,0-7.426Z"
      transform="translate(-2.087 -4.87)"
    />
  </svg>
</template>

<script>
export const THEME_LIGHT = "light";
export const THEME_DARK = "dark";

export default {
  name: "Favorite",
  emits: ["click"],
  props: {
    isAdded: {
      type: [Boolean, Number],
      default: false,
    },
    theme: {
      type: String,
      default: THEME_LIGHT,
      validate(value) {
        return [THEME_LIGHT, THEME_DARK].includes(value);
      },
    },
  },
  computed: {
    css() {
      return this.theme;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/mystyles.scss";

svg.favorite {
  path {
    &.light {
      fill: #dbdbdb;
    }
    &.dark {
      fill: #6c6c6c;
    }
  }

  &.added {
    path {
      &.light {
        fill: $dark-gray;
      }
      &.dark {
        fill: #fff;
      }
    }
  }
}
</style>
