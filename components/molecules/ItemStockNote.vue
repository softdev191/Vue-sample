<template>
  <div class="s-item--acc--note">
    <dl>
      <dt class="s-item--acc--note--def-t">在庫状況：</dt>
      <dd class="s-item--acc--note--def-d">○在庫あり △残りわずか ×在庫なし</dd>
    </dl>
    <ul class="s-item--acc--note--caution">
      <li class="s-item--acc--note--caution__i">
        在庫ありの表示でも、店頭では売り切れの場合がございます。
      </li>
      <li class="s-item--acc--note--caution__i">
        電話でのお取り置きやお取り寄せは行っていませんのでご注意ください。
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ItemStockNote",
};
</script>

<style lang="scss" scoped>
.s-item--acc--note {
  &--def-t {
    display: inline-block;
    font-weight: 700;
    font-size: 13px;
  }
  &--def-d {
    display: inline-block;
    font-size: 13px;
  }
  &--caution {
    list-style: "※";
    margin-top: 4px;

    @include desktop {
      display: flex;
    }

    &__i {
      padding-left: 3px;
      margin-left: 8px;
      line-height: 18px;
      font-size: 12px;
      vertical-align: bottom;

      @include desktop {
        margin-right: 6px;
      }
    }
  }
}
</style>
