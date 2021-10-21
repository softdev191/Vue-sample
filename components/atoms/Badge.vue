<template>
  <div class="o-badge"><slot></slot></div>
</template>

<script>
export default {
  name: "Badge",
};
</script>

<style lang="scss" scoped>
.o-badge {
  display: block;
  color: #fff;
  font-size: 8px;
  width: 18px;
  height: 18px;
  text-align: center;
  padding-top: 2px;
  border: 1px solid #000;
  background-color: #000;
  border-radius: 50%;
  z-index: 1;
}
</style>
