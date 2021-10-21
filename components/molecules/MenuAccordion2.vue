<template>
  <div>
    <div>
      <ul class="menu-list" :class="{ 'a2-open': open }">
        <li>
          <a @click="open = !open">
            <slot name="head" :open="open"></slot>
            <div class="angle-right" :class="{ rotate: !open }"></div>
          </a>
        </li>
      </ul>
    </div>
    <transition name="fade">
      <div v-show="open">
        <slot name="body" :open="open"></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      open: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.menu-label {
  border-bottom: solid 1px #a7a7a7;
  padding: 0 5px;
  color: #4a4a4a;
  margin: 30px 5px 0 5px;
  font-size: 15px;
}
.menu-list {
  li {
    font-size: 12px;
    height: 46px;
    a {
      position: relative;
      padding: 0;
    }
    .label {
      border-bottom: solid 1px #dbdbdb;
      padding: 15px 5px;
      margin: 0 5px 0 5px;
      font-weight: 400;
    }
    .checkbox {
      border-bottom: solid 1px #dbdbdb;
      padding: 5px;
      margin: 0 5px;
      font-weight: 400;
    }
  }
  &.a2-open {
    li {
      .label {
        border-bottom: 0;
      }
    }
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
    top: 18px;
    right: 10px;
    transition-duration: 0.3s;
  }
}
.angle-right {
  border: solid black;
  border-width: 0 1px 1px 0;
  display: inline-block;
  position: absolute;
  padding: 4px;
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  top: 16px;
  right: 10px;
  transition-duration: 0.3s;
  &.rotate {
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
    top: 18px;
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
