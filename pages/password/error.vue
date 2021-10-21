<template>
  <div class="login-container">
    <template v-if="errorCode == 'MemberNotFound'">
      <ErrorBox title="有効な認証URL">
        この認証URLは有効ではありません、有効な認証URLを押してください。
      </ErrorBox>
      <ButtonWrapper theme="flex" class-name="mt24">
        <ButtonLink to="/" theme="light">トップに戻る</ButtonLink>
        <ButtonLink to="/password/email" theme="dark"
          >パスワード再設定</ButtonLink
        >
      </ButtonWrapper>
    </template>
    <template v-else>
      <ErrorBox title="エラー">
        パスワード再設定に失敗しました。<br />再度最初から登録手続きをお願い致します。
      </ErrorBox>
      <ButtonWrapper theme="flex" class-name="mt24">
        <ButtonLink to="/" theme="light">トップに戻る</ButtonLink>
        <ButtonLink to="/password/email" theme="dark"
          >パスワード再設定</ButtonLink
        >
      </ButtonWrapper>
    </template>
  </div>
</template>

<script>
import ErrorBox from "@/components/atoms/ErrorBox";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import ButtonLink from "@/components/atoms/ButtonLink";

export default {
  components: {
    ErrorBox,
    ButtonWrapper,
    ButtonLink,
  },
  computed: {
    errorCode() {
      return this.$route.query.error_code;
    },
  },
  head() {
    return {
      title: "エラー",
    };
  },
};
</script>
