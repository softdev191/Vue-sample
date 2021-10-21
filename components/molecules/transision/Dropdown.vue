<template>
  <div class="dropdown-wrapper">
    <transition
      name="dropdown"
      :css="false"
      @before-enter="beforeEnter"
      @enter="enter"
      @before-leave="beforeLeave"
      @leave="leave"
    >
      <slot />
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    maxHeight: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    beforeEnter(el) {
      el.style.maxHeight = "0";
    },
    enter(el, done) {
      el.style.transitionProperty = "max-height";
      el.style.transitionDuration = "0.3s";
      el.style.maxHeight = `${this.maxHeight}px`;
      window.setTimeout(done, 1000);
    },
    beforeLeave(el) {
      el.style.maxHeight = `${this.maxHeight}px`;
    },
    leave(el, done) {
      el.style.transitionProperty = "max-height";
      el.style.transitionDuration = "0.3s";
      el.style.maxHeight = 0;
      window.setTimeout(done, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
.dropdown-wrapper {
  overflow: hidden;
  height: 100%;
}
</style>
