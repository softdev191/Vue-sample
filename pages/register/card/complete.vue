<template>
  <div class="login-container">
    <ErrorBox v-if="error">{{ error }}</ErrorBox>
    <PageTitle class="center">
      認証メールを{{ hasResent ? "再送" : "送信" }}しました。<br />
      まだ手続きは完了していません。
    </PageTitle>
    <p class="fs12 mb20">
      ※入力されたメールアドレス宛に、認証メールを送信しました。届いたメール内に記載されているURLをクリックして、お客様情報の入力を完了させてください。<br />
      ※受信までに数十分の時差がある場合もございます。
    </p>
    <div class="form-wrapper">
      <div class="form-group">
        <label class="form-label">メールアドレス</label>
        <label class="form-label">{{ email }}</label>
      </div>
      <div class="form-text">
        入力したメールアドレス宛に認証メールが届かないお客さまは、[認証メールを再送する]ボタンを押してください。
      </div>
      <div class="form-group">
        <ButtonWrapper theme="normal" class-name="mt20">
          <Button theme="light" :disabled="!canResend" @click="resend">
            認証メールを再送する
            <template v-if="seconds > 0">({{ seconds }}s)</template>
          </Button>
        </ButtonWrapper>
      </div>
      <BaseDialog
        ref="resendDialog"
        title=""
        :has-ok="false"
        :has-cancel="false"
      >
        認証メールを再送しました。<br />まだ手続きは完了していません。
      </BaseDialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ErrorBox from "@/components/atoms/ErrorBox";
import PageTitle from "@/components/atoms/PageTitle";
import BaseDialog from "@/components/atoms/BaseDialog";
import { extractFlatValidationError } from "@/plugins/vee-validate";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";

export default {
  components: {
    ErrorBox,
    PageTitle,
    BaseDialog,
    ButtonWrapper,
    Button,
  },
  data() {
    return {
      error: null,
      hasResent: false,
      intervalId: null,
      seconds: 5,
    };
  },
  computed: {
    ...mapGetters({
      email: "register/old/email",
      emailConfirm: "register/old/emailConfirm",
      cardId: "register/old/cardId",
      pinCode: "register/old/pinCode",
    }),
    canResend() {
      return this.seconds <= 0;
    },
  },
  mounted() {
    const _this = this;
    this.intervalId = setInterval(function () {
      if (_this.seconds > 0) {
        _this.seconds--;
      }
    }, 1000);
  },
  beforeDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
  methods: {
    async resend() {
      try {
        await this.$api.store("old_member/mail_auth/check", {
          email: this.email,
          email_confirm: this.emailConfirm,
          card_id: this.cardId,
          pin: this.pinCode,
        });
        this.$refs.resendDialog.show();
      } catch (error) {
        const messages = extractFlatValidationError(error);
        this.error = messages[0];
      }
      this.hasResent = true;
    },
  },
  head() {
    return {
      title: "既存会員引き続き",
    };
  },
};
</script>
