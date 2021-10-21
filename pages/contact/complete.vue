<template>
  <div class="fixed-container">
    <div class="page-title center">お問い合わせ受付完了しました。</div>
    <p class="text mb20">
      お問い合わせありがとうございます。<br />
      {{ contact.lastName }}
      {{
        contact.firstName
      }}様からのお問い合わせを受付させていただきました。<br />
      いただいたお問い合わせ内容およびに受付完了として、記載していただいたメールアドレス宛に受付完了メールを送付させていただいています。<br />
      1時間経っても届かない場合は、お⼿数おかけいたしますが、再度お問い合わせフォームより⼊⼒していただいて、お問い合わせしていただけると幸いです。<br />
    </p>
    <p class="text">
      引き続き、ヤマダヤオンラインストアでのショッピングをお楽しみくださいませ。
    </p>
    <div class="form-group">
      <ButtonWrapper theme="normal" class-name="mt25">
        <ButtonLink to="/" theme="light">トップに戻る</ButtonLink>
      </ButtonWrapper>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import ButtonLink from "@/components/atoms/ButtonLink";

export default {
  components: {
    ButtonWrapper,
    ButtonLink,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      contact: "contact/data",
    }),
  },
};
</script>

<style lang="scss" scoped>
.text {
  font-size: 12px;
  &.kome {
    position: relative;
    padding-left: 1rem;
    &::before {
      content: "※";
      position: absolute;
      left: 0;
    }
  }
}
.error {
  position: relative;
  color: $error;
  font-size: 10px;
  padding-left: 1rem;
  &::before {
    content: "*";
    position: absolute;
    top: -3px;
    left: 0;
    font-size: 30px;
    line-height: 1;
  }
}
.error-msg {
  font-size: 10px;
  color: $error;
  margin-top: 4px;
}
.security {
  border-bottom: 1px solid $black;
}
.mt25 {
  margin-top: 25px;
}
.mb10 {
  margin-bottom: 10px;
}
.mb20 {
  margin-bottom: 20px;
}
.mb25 {
  margin-bottom: 25px;
}
.mb30 {
  margin-bottom: 30px;
}
</style>
