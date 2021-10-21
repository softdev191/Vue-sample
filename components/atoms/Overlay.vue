<template>
  <div class="orverlay">
    <slot />
  </div>
</template>

<script>
export default {
  name: "Overlay",
};
</script>

<style lang="scss" scoped>
.orverlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10000;
  background-color: #fff;
  opacity: 0.24;
}
</style>
