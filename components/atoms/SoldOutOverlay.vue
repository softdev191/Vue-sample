<template>
  <div class="sold-out">SOLD OUT</div>
</template>

<script>
export default {
  name: "SoldOutOverlay",
};
</script>

<style lang="scss" scoped>
.sold-out {
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  text-align: center;
  width: 100%;
  font-size: 30px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  color: #fff;
  background: rgba(15, 15, 15, 0.3);
}
</style>
