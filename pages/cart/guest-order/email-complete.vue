<template>
  <div class="login-container">
    <SuccessBox v-if="successMessage">{{ successMessage }}</SuccessBox>
    <ErrorBox v-if="error">{{ error }}</ErrorBox>
    <PageTitle class="center">
      受け取り確認メールを送信しました。
      メール内のURLより購入手続きにお進みください。
    </PageTitle>
    <p class="fs12 mb20">
      入力されたメールアドレス宛に、受信確認メールを送信しました。届いたメール内に記載されているURLをクリックすると、
      購入手続きに進むことができます。
    </p>
    <div class="form-wrapper">
      <div class="form-group">
        <ButtonWrapper theme="normal" class-name="mt20">
          <Button theme="light" :disabled="pending" @click="handleResend">
            受け取り確認メールを再送する
          </Button>
        </ButtonWrapper>
      </div>
      <div>
        <InformationMessage
          dialog-title="メールが届かない場合"
          class="point-message"
        >
          <template v-slot:message>
            (１)【メール受信ボックス内】と【迷惑メールフォルダ内】で、下記を確認してください。<br />
            ・最新の受信状態に更新する
            ・「●●@ymdy.co.jp」のメールアドレスを検索<br />
            (２)それでも見つからない場合<br />
            ・メールを受信出来るように、「@ymdy.co.jp」のドメイン指定をお願いします。<br />
            ・入力間違えがないかご確認の上、再度[新しいメールアドレス]を入力し直してください。<br />
            例1）単語や、1文字が抜けている 例2）.や-が多く入力されている<br />
            例3）.ne.jpが.co.jpや.comになっている<br />
            例4）小文字が大文字になっている<br />
          </template>
        </InformationMessage>
      </div>
    </div>
  </div>
</template>

<script>
import ErrorBox from "@/components/atoms/ErrorBox";
import PageTitle from "@/components/atoms/PageTitle";
import InformationMessage from "@/components/molecules/InformationMessage";
import SuccessBox from "@/components/atoms/SuccessBox";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";
import { extractFlatValidationError } from "@/plugins/vee-validate";
import { CartCredentialProvider } from "@/plugins/storage-provider/cart-credential";

export default {
  components: {
    ErrorBox,
    SuccessBox,
    PageTitle,
    InformationMessage,
    ButtonWrapper,
    Button,
  },
  data() {
    return {
      error: null,
      successMessage: null,
      pending: false,
    };
  },
  beforeDestroy() {
    this.$store.commit("clearSessionData", "guestOrderEmail");
  },
  methods: {
    async handleResend() {
      if (this.pending) {
        return;
      }

      try {
        this.pending = true;
        const { cartId, token } = CartCredentialProvider.getCredentials();
        const email = this.$store.getters.sessionData.guestOrderEmail;
        this.successMessage = null;

        await this.$api.store(`guest_purchase/${cartId}/email_auth`, {
          email,
          email_confirmation: email,
          token,
        });

        this.successMessage = "メールを再送しました。";
      } catch (error) {
        const messages = extractFlatValidationError(error);
        this.error = messages[0];
      } finally {
        this.pending = false;
      }
    },
  },
  head() {
    return {
      title:
        "受け取り確認メールを送信しました。メール内のURLより購入手続きにお進みください。",
    };
  },
};
</script>
