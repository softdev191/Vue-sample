<template>
  <div class="login-container">
    <CompleteMessage class="complete">
      <template #title>
        お客様の情報を、<br />
        以前のヤマダヤ会員(旧名:YMDYメンバーズ)から、<br />
        新ヤマダヤ会員へ移行が完了致しました。<br />
        <br />
        また、事前登録キャンペーンへの<br />
        ご登録の確認もできました。<br />
        <br />
        事前登録キャンペーン、そして今回の会員移行手続きに<br />
        ご対応いただいたお礼として、<br />
        【1,000pt】の付与を致しました。<br />
        <br />
        新しくなったYAMADAYAオンラインストアでの<br />
        お買い物をお楽しみくださいませ。<br />
        <br />
        これからもどうぞよろしくお願い致します。
      </template>
      <template #body>
        <ButtonWrapper class-name="mt24">
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
};
</script>
