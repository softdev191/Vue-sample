<template>
  <div class="wrap">
    <transition name="page">
      <Nuxt />
    </transition>
  </div>
</template>

<script>
export default {
  components: {},
};
</script>

<style lang="scss">
html {
  -webkit-overflow-scrolling: touch;
  font-size: 75% !important;
}
body {
  overflow-x: hidden;
  overflow-y: visible;
  background-color: #fff;
}
</style>
