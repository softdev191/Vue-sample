<template>
  <div>
    <div>
      <ul class="menu-list">
        <li class="bordered">
          <a @click="show = !show">
            <slot name="head"></slot>
            <div class="angle-up" :class="{ rotate: !show }"></div>
          </a>
        </li>
      </ul>
    </div>
    <transition name="fade">
      <div v-show="show" class="wrap">
        <slot name="body"></slot>
        <ul class="menu-list">
          <li>
            <a @click="show = !show">
              <slot name="footer"></slot>
            </a>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: true,
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.wrap {
  padding: 0 0 0 10px;
}
.menu-label {
  border-bottom: solid 1px #a7a7a7;
  padding: 0 5px;
  color: #4a4a4a;
  margin: 30px 5px 0 5px;
  font-size: 15px;
}

.menu-list li {
  font-size: 12px;
  height: 46px;
  a {
    position: relative;
    padding: 0;
  }
  &.bordered {
    border-top: solid 1px #dbdbdb;
  }
  &.close {
    border: 0;
  }
}

.angle-up {
  border: solid black;
  border-width: 0 1px 1px 0;
  display: inline-block;
  position: absolute;
  padding: 4px;
  transform: rotate(225deg);
  -webkit-transform: rotate(225deg);
  top: 20px;
  right: 10px;
  transition-duration: 0.3s;
  &.rotate {
    transform: rotate(405deg);
    -webkit-transform: rotate(405deg);
    top: 16px;
    right: 10px;
    transition-duration: 0.3s;
  }
}
.fade-enter-active {
  transition: opacity 0.7s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
