<template>
  <div class="alert-area">
    <div class="title mb-5">注意事項</div>
    <div class="contents">
      表⽰価格はすべて「税込」の価格を表⽰しています。セール価格の商品は、お客様都合での返品を受け付けていません。詳しくはヘルプページをご覧ください。
    </div>
  </div>
</template>

<script>
export default {
  components: {},
};
</script>

<style lang="scss" scoped>
.alert-area {
  margin: 0 10px;
  padding: 20px 13px;
  background-color: $gray;
  .title {
    font-size: $size-6;
    font-weight: bold;
  }
  .contents {
    line-height: 2;
  }
}
</style>
