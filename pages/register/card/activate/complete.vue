<template>
  <div class="login-container">
    <CompleteMessage class="complete">
      <template #title>
        新YAMADAYA会員への登録が完了しました。<br />現在、ログイン中です。
      </template>
      <template #body>
        <ButtonWrapper class-name="mt80">
          <ButtonLink to="/" theme="light">トップに戻る</ButtonLink>
        </ButtonWrapper>
      </template>
    </CompleteMessage>
  </div>
</template>

<script>
import CompleteMessage from "@/components/molecules/CompleteMessage";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import ButtonLink from "@/components/atoms/ButtonLink";

export default {
  components: {
    CompleteMessage,
    ButtonWrapper,
    ButtonLink,
  },
  head() {
    return {
      title: "新YAMADAYA会員への登録完了",
    };
  },
};
</script>
