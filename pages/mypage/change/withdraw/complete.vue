<template>
  <div class="fixed-container">
    <Breadcrumb text="HOME > マイページ > 退会の手続き" />
    <div class="mypage-layout">
      <SideMenu />
      <div class="mypage-main">
        <div class="page-title center">
          退会が完了しました。<br />
          ありがとうございました。
        </div>
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
import Breadcrumb from "@/components/partials/Breadcrumb";
import SideMenu from "@/components/pages/mypage/SideMenu";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";

export default {
  components: {
    Breadcrumb,
    SideMenu,
    ButtonWrapper,
    Button,
  },
  methods: {
    home() {
      this.$router.push("/");
    },
  },
  head() {
    return {
      title: "退会の手続き完了",
    };
  },
};
</script>
