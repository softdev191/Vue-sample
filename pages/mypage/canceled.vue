<template>
  <div class="fixed-container">
    <Breadcrumb text="HOME > マイページ > キャンセル完了" />
    <div class="mypage-layout">
      <SideMenu />
      <div class="mypage-main">
        <p class="cancel-completed">ご注文のキャンセルが完了しました</p>
        <PageTitle>購入履歴・発送状況・キャンセル</PageTitle>
        <InformationMessage
          dialog-title="お客さま都合の注文キャンセルについて"
          class="point-message"
        >
          <template v-slot:message>
            ・ご注文完了後１時間以内は、ご注文のキャンセルが可能です。<br />
            ・ご希望の場合は購入履歴・発送状況・キャンセルページの「注文をキャンセルする」からお手続きください。<br />
            ※キャンセルは注文単位です。<br />
            ※複数点ご注文の場合の一部商品キャンセルは出来ません。ご注文をキャンセル後、再度ご注文をし直してください。（キャンセルした商品分の在庫はショップに戻りますが、人気商品は直ぐに売り切れてしまう場合がございます。予めご了承ください。）<br /><br />
            ・１時間経過したご注文のキャンセルはお受けしておりません。
          </template>
        </InformationMessage>
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from "@/components/atoms/PageTitle";
import Breadcrumb from "@/components/partials/Breadcrumb";
import SideMenu from "@/components/pages/mypage/SideMenu";
import InformationMessage from "@/components/molecules/InformationMessage";

export default {
  components: {
    PageTitle,
    Breadcrumb,
    SideMenu,
    InformationMessage,
  },
  head() {
    return {
      title: "購入履歴・発送状況・キャンセル",
    };
  },
};
</script>

<style lang="scss" scoped>
.cancel-completed {
  color: #6c6c6c;
  font-size: 20px;
  font-weight: 600;
}
</style>
