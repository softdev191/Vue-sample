<template>
  <div
    :class="{ dark: isDark, light: isLight, gray: isGray }"
    class="background"
    :style="setBackgroundColor"
  >
    <div class="columns is-gapless">
      <div class="column has-text-centered">
        <span class="is-size-3 mr-4">{{ title }}</span>
      </div>
    </div>
    <div class="columns is-gapless">
      <div class="column">
        <div class="top-divider" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    theme: {
      type: String,
      default: "light",
    },
    title: {
      type: String,
      required: true,
    },
    background: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      notify: {},
    };
  },
  computed: {
    isDark() {
      return this.theme === "dark";
    },
    isLight() {
      return this.theme === "light";
    },
    isGray() {
      return this.theme === "gray";
    },
    setBackgroundColor() {
      return {
        "--background-color": this.background,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.background {
  background-color: var(--background-color);
}
.light {
  padding: 45px 0 50px 0;
  .top-divider {
    border-top: solid 1px #000;
    width: 40px;
    margin: 0 auto;
  }
}
.dark {
  padding: 45px 0 50px 0;
  background-color: #505050;

  .column {
    color: #fff;
  }
  .top-divider {
    border-top: solid 1px #fff;
    width: 40px;
    margin: 0 auto;
  }
}
.gray {
  padding: 45px 0 50px 0;
  background-color: $gray;

  .top-divider {
    border-top: solid 1px #000;
    width: 40px;
    margin: 0 auto;
  }
}
</style>
