<template>
  <div>
    <h2 class="content is-size-5 mb-1">店舗情報</h2>
    <div class="divider mb-5" />
    <div class="fs12 mb-1 mx-3">{{ shop.name }}</div>
    <div class="fs10 mb-3 mx-3">住所：{{ shop.address }}</div>
    <div class="columns is-mobile is-gapless">
      <div class="column has-text-centered">
        <button class="button fs12">MAP</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shop: {
        name: "イオンモール札幌平岡 MAITRESSE, SCOTCLUB",
        address: "〒004-0873 北海道札幌市清田区平岡3条5丁目3-1",
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.content {
  padding: 0 10px;
}
.button {
  display: block;
  margin: 0 10px 0 auto;
  flex: none;
  width: 100px;
  height: 30px;
  align-items: center;
  border: 1px solid $black;
  border-radius: 0;
  box-shadow: none;
}
</style>
