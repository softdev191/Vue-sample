<template>
  <div class="login-container">
    <template
      v-if="
        errorCode == 'MailAuthAlreadyDone' ||
        errorCode == 'MemberTransferredAlreadyDone'
      "
    >
      <ErrorBox title="本登録済み">
        既に本登録済です。<br />ログイン画面より、ログインしてください。
      </ErrorBox>
      <ButtonWrapper class-name="mt24">
        <ButtonLink to="/login" theme="light">ログイン</ButtonLink>
      </ButtonWrapper>
    </template>
    <template v-else-if="errorCode == 'UrlExpired'">
      <ErrorBox title="有効期限切れ">
        このURLの有効期限は切れています。<br />ログイン画面より新規登録をお願い致します。
      </ErrorBox>
      <ButtonWrapper class-name="mt24">
        <ButtonLink to="/login" theme="light">ログイン</ButtonLink>
      </ButtonWrapper>
    </template>
    <template v-else-if="errorCode == 'MailAuthExpired'">
      <ErrorBox title="有効期限切れ">
        新規登録用の認証URLの有効期限が切れています。<br />再度最初から登録手続きをお願い致します。
      </ErrorBox>
      <ButtonWrapper theme="flex" class-name="mt24">
        <ButtonLink to="/" theme="light">トップに戻る</ButtonLink>
        <ButtonLink to="/register" theme="dark">新規登録</ButtonLink>
      </ButtonWrapper>
    </template>
    <template v-else>
      <ErrorBox title="登録エラー">
        登録に失敗しました。<br />再度最初から登録手続きをお願い致します。
      </ErrorBox>
      <ButtonWrapper theme="flex" class-name="mt24">
        <ButtonLink to="/" theme="light">トップに戻る</ButtonLink>
        <ButtonLink to="/register" theme="dark">新規登録</ButtonLink>
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
