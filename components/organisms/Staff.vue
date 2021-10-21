<template>
  <div class="staff-container">
    <div class="columns is-mobile is-multiline is-gapless">
      <div class="column mb-6" :class="[pcClass, spClass]">
        <figure class="image is-fullwidth mb-3">
          <img src="@/assets/images/stylings1.png" />
        </figure>
      </div>

      <div class="column mb-6" :class="[pcClass, spClass]">
        <figure class="image is-fullwidth mb-3">
          <img src="@/assets/images/stylings1.png" />
        </figure>
      </div>

      <div class="column mb-6" :class="[pcClass, spClass]">
        <figure class="image is-fullwidth mb-3">
          <img src="@/assets/images/stylings1.png" />
        </figure>
      </div>

      <div class="column mb-6" :class="[pcClass, spClass]">
        <figure class="image is-fullwidth mb-3">
          <img src="@/assets/images/stylings1.png" />
        </figure>
      </div>

      <div class="column mb-6" :class="[pcClass, spClass]">
        <figure class="image is-fullwidth mb-3">
          <img src="@/assets/images/stylings1.png" />
        </figure>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    desktopSize: {
      type: Number,
      default: 4,
    },
    spDisplay: {
      type: Number,
      default: 3,
    },
  },
  data() {
    return {
      notify: {},
    };
  },
  computed: {
    spClass() {
      return this.spDisplay === 3 ? "sp-three" : "sp-two";
    },
    pcClass() {
      return this.desktopSize === 4 ? "four" : "five";
    },
  },
};
</script>

<style lang="scss" scoped>
.staff-container {
  margin: auto 5px;
}
.columns {
  justify-content: space-between;
}
.column {
  padding: 0;
  @include touch {
    &.sp-two {
      flex: none;
      width: calc(50% - 3px);
    }
    &.sp-three {
      flex: none;
      width: calc(33% - 3px);
    }
  }

  @include desktop {
    &.four {
      flex: none;
      width: calc(25% - 3px);
    }
    &.five {
      flex: none;
      width: calc(20% - 3px);
    }
  }
}
</style>
