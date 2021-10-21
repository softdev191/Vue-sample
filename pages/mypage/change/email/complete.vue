<template>
  <div class="fixed-container">
    <Breadcrumb text="HOME > マイページ > メールアドレス変更" />
    <div class="mypage-layout">
      <SideMenu />
      <div class="mypage-main">
        <PageTitle class="center">
          メールアドレス変更が完了しました。<br />
          引き続き買い物をお楽しみください。
        </PageTitle>
        <div class="form-group">
          <ButtonWrapper theme="normal" class-name="mt30">
            <Button theme="light" @click="home">トップに戻る</Button>
          </ButtonWrapper>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from "@/components/atoms/PageTitle";
import Breadcrumb from "@/components/partials/Breadcrumb";
import SideMenu from "@/components/pages/mypage/SideMenu";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";

export default {
  components: {
    PageTitle,
    Breadcrumb,
    SideMenu,
    ButtonWrapper,
    Button,
  },
  async fetch() {
    await this.$auth.fetchUser();
  },
  methods: {
    home() {
      this.$router.push("/");
    },
  },
  head() {
    return {
      title: "メールアドレス変更完了",
    };
  },
};
</script>
