<template>
  <div>
    <client-only>
      <div class="divider"></div>
      <div class="accordion" :class="theme">
        <div class="header" @click="toggle">
          {{ title }}
          <div class="header-icon angle-down" :class="{ rotate: show }"></div>
        </div>
        <div class="divider"></div>
        <transition
          name="accordion"
          class="mb-6"
          @before-enter="beforeEnter"
          @enter="enter"
          @before-leave="beforeLeave"
          @leave="leave"
        >
          <div v-show="show" class="body">
            <div v-for="(brand, index) in storeBrands" :key="index">
              <nuxt-link :to="prefix + brand.label.toLowerCase()">
                <div class="body-inner">{{ brand.label }}</div>
              </nuxt-link>
              <div class="mini-divider" />
            </div>
          </div>
        </transition>
      </div>
    </client-only>
  </div>
</template>

<script>
export default {
  props: {
    theme: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "ストアブランド一覧",
    },
  },
  data() {
    return {
      show: false,
      prefix: "",
    };
  },
  computed: {
    storeBrands() {
      return this.$store.getters["master/enums"].common__store_brand;
    },
  },
  mounted() {
    this.prefix = window.location.pathname === "/" ? "brands/" : "";
  },
  methods: {
    toggle() {
      this.show = !this.show;
    },
    // enter: function(el, done) {
    //   $(el).slideDown(150, done);
    // },
    // leave: function(el, done) {
    //   $(el).slideUp(150, done);
    // },
    beforeEnter(el) {
      el.style.height = "0";
    },
    enter(el) {
      el.style.height = el.scrollHeight + "px";
    },
    beforeLeave(el) {
      el.style.height = el.scrollHeight + "px";
    },
    leave(el) {
      el.style.height = "0";
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  height: 48px;
  line-height: 48px;
  padding: 0 40px 0 10px;
  position: relative;
  color: #777;
  cursor: pointer;
  font-size: $size-5;
}

.accordion .body {
  background-color: #fff;
  transition: 150ms ease-out;
}

.accordion .body-inner {
  height: 48px;
  line-height: 48px;
  margin-left: 25px;
  background-color: #fff;
  transition: 150ms ease-out;
  font-size: $size-5;
}

.angle-down {
  border: solid black;
  border-width: 0 1px 1px 0;
  display: inline-block;
  padding: 6px;
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  position: absolute;
  top: 15px;
  right: 13px;
  transition-duration: 0.3s;

  &.rotate {
    top: 20px;
    right: 13px;
    transform: rotate(225deg);
    transition-duration: 0.3s;
  }
}
</style>
