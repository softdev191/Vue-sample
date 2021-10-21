<template>
  <component :is="tag" class="btn-wrap" :class="{ pending: pending }">
    <button
      class="button"
      :class="css"
      :disabled="pending || disabled"
      @click.prevent="handleClick"
    >
      <span>
        <slot :on="on" />
        <slot name="icon" :on="on">
          <svg
            v-show="icon"
            class="favorite"
            xmlns="http://www.w3.org/2000/svg"
            width="16.287"
            height="17.166"
            viewBox="0 0 16.287 17.166"
          >
            <path
              id="Icon_feather-heart"
              class="svg"
              data-name="Icon feather-heart"
              d="M17.053,6.171c-1.867-1.606-5.471-2.279-6.789,2.641C8.935,3.851,5.516,4.319,3.475,6.171s-1.65,5.376,0,7.426l.814,1.012,5.975,7.426,5.975-7.426.814-1.012c1.651-2.05,1.867-5.821,0-7.426Z"
              transform="translate(-2.087 -4.87)"
              fill="#dbdbdb"
            />
          </svg>
        </slot>
      </span>
      <Spiner :size="3" v-if="pending" />
    </button>
  </component>
</template>

<script>
import Spiner from "~/components/atoms/loading/Spiner";
export const THEME_LIGHT = "light";
export const THEME_DARK = "dark";
export const THEME_GRAY = "gray";
export const THEME_FAVORITE = "favorite";
export const THEME_DISABLED = "disabled";

export default {
  components: {
    Spiner,
  },
  emits: ["click"],
  props: {
    /**
     * Style
     * light/dark/gray/favorite
     */
    theme: {
      type: String,
      default: THEME_LIGHT,
      validate(value) {
        return [
          THEME_LIGHT,
          THEME_DARK,
          THEME_GRAY,
          THEME_FAVORITE,
          THEME_DISABLED,
        ].includes(value);
      },
    },
    icon: {
      type: Boolean,
      default: false,
    },
    on: {
      type: Boolean,
      default: false,
    },
    pending: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    tag: {
      type: String,
      default: "div",
    },
  },
  computed: {
    css() {
      if (this.disabled) {
        return THEME_DISABLED;
      }

      const css = [this.theme];

      if (this.theme === THEME_FAVORITE && this.on) {
        css.push("on");
      }

      return css;
    },
  },
  methods: {
    handleClick(event) {
      this.$emit("click", event);
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-wrap {
  text-align: center;
  margin-bottom: 10px;

  &.pending {
    opacity: 0.5;
  }

  .button {
    width: 100%;
    height: 42px;
    border-radius: 0;
    box-shadow: none;
    display: inline-flex;
    font-size: $size-6;
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
    &.favorite {
      border: 1px solid #6c6c6c;
      background-color: #dbdbdb;
      color: #000;
      &:hover {
        background-color: #fff;
      }
      &.on {
        border: 0;
        background-color: #dbdbdb;
        color: #fff;
        &:hover {
          background-color: #dbdbdb;
        }
      }
    }
    &.disabled {
      border: 0;
      background-color: #dbdbdb;
      color: #6c6c6c;
      opacity: 1;
    }
  }

  span {
    position: relative;
    svg {
      position: absolute;
      top: 0;
      left: -20px;
      .svg {
        fill: #6c6c6c;
      }
    }
  }

  .loading {
    position: absolute;
  }
}
.redispaly-requested {
  .button {
    @include touch {
      width: 100%;
    }
  }
}
</style>
