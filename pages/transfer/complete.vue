<template>
  <div class="fixed-container">
    <ErrorBox v-if="error">{{ error }}</ErrorBox>
    <CompleteMessage>
      <template #title>
        <div v-if="!hasResent">
          ※まだ移行手続き完了していません、<br />
          お気をつけください。<br />
          <br />
          会員システムと照合した結果、<br />
          メールアドレスの確認ができました。<br />
          <br />
          入力されたメールアドレス宛に、<br />
          認証メールを送信しました。
        </div>
        <div v-else>
          ※まだ移行手続き完了していません、<br />
          お気をつけください。<br />
          <br />
          入力されたメールアドレス宛に、<br />
          認証メールを再送しました。
        </div>
      </template>
      <template #body>
        <p class="text kome mt30 align-left">
          届いたメール内に記載されているURLをクリックして、認証手続きを完了してください
        </p>
        <p class="text kome mb23 align-left">
          受信までに数十分の時差がある場合もございます。
        </p>
        <div class="text align-left mb30">
          <p>メールアドレス</p>
          <p>{{ email }}</p>
        </div>
        <p class="form-text mb23 align-left">
          入力したメールアドレス宛に認証メールが届かないお客さまは、[認証メールを再送する]ボタンを押してください。
        </p>
        <ButtonWrapper class-name="mt24">
          <Button theme="light" @click="resend">認証メールを再送する</Button>
        </ButtonWrapper>
      </template>
    </CompleteMessage>
    <BaseDialog ref="resendDialog" title="" :has-ok="false" :has-cancel="false">
      ※まだ移⾏⼿続き完了していません、<br />お気をつけください。<br /><br />
      入力されたメールアドレス宛に、<br />認証メールを再送しました。
    </BaseDialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ErrorBox from "@/components/atoms/ErrorBox";
import CompleteMessage from "@/components/molecules/CompleteMessage";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";
import BaseDialog from "@/components/atoms/BaseDialog";
import { extractFlatValidationError } from "@/plugins/vee-validate";

export default {
  components: {
    ErrorBox,
    CompleteMessage,
    ButtonWrapper,
    Button,
    BaseDialog,
  },
  data() {
    return {
      error: null,
      hasResent: false,
    };
  },
  computed: {
    ...mapGetters({
      name: "transfer/name",
      email: "transfer/email",
      formData: "transfer/formData",
    }),
  },
  methods: {
    async resend() {
      try {
        await this.$api.store("old_member/send_email", this.formData);
        this.hasResent = true;
        this.$refs.resendDialog.show();
      } catch (error) {
        const messages = extractFlatValidationError(error);

        this.$router.push({
          path: "/login",
          query: { error: messages[0] },
        });
      }
    },
  },
  head() {
    return {
      title: "新ヤマダヤ会員移⾏⼿続きについて",
    };
  },
};
</script>

<style lang="scss" scoped>
.text {
  font-size: 12px;
  line-height: 22px;

  &.right {
    text-align: right;
  }
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
.align-left {
  text-align: left;
}
</style>
