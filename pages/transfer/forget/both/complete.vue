<template>
  <div class="fixed-container">
    <CompleteMessage class="complete">
      <template #title>
        <PageTitle class="center">
          ご本人様確認の申請を受付致しました。<br />
          のちほど、担当者よりご連絡させていただきます。
        </PageTitle>
      </template>
      <template #body>
        <p class="text align-left mb20">
          ご本人様確認の申請受付完了メールを、ご入力いただいたメールアドレス宛てに送信致しました。<br />
          大変お手数ですが、ご確認ください。<br />
          ※受信までに数十分の時差がある場合もございます。<br />
          <br />
          ◆申請が混雑している場合や、ご登録状況によりましてはご対応までにお時間をいただく場合がございます。<br />
          あらかじめご了承下さい。<br />
          <br />
          ◆弊社から1週間以上返信が無い場合は”フォーム送信エラー”の場合がございます。<br />
          その際はお手数をお掛けして申し訳ございませんが、再度ご本人様確認の申請をいただきますようお願い致します。<br />
        </p>
      </template>
    </CompleteMessage>
    <div class="form-group">
      <ButtonWrapper theme="normal" class-name="mt30">
        <Button theme="light" @click="close">閉じる</Button>
      </ButtonWrapper>
    </div>
  </div>
</template>

<script>
import PageTitle from "@/components/atoms/PageTitle";
import CompleteMessage from "@/components/molecules/CompleteMessage";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";

export default {
  components: {
    PageTitle,
    CompleteMessage,
    ButtonWrapper,
    Button,
  },
  methods: {
    close() {
      this.$router.push("/login");
    },
  },
  head() {
    return {
      title:
        "旧ヤマダヤ会員(旧名:YMDYメンバーズ)に登録していたメールアドレスにメールが届かない場合",
    };
  },
};
</script>
