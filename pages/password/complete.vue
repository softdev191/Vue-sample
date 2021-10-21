<template>
  <div class="fixed-container">
    <ErrorBox v-if="error">{{ error }}</ErrorBox>
    <PageTitle class="center">
      パスワード再設定メールを{{ hasResent ? "再送" : "送信" }}しました。<br />
      まだ再設定は完了していません。
    </PageTitle>
    <p class="text mb20">
      {{ email }}宛にパスワード再設定メールを送信しました。
      60分以内にメール内に記載されているURLをクリックして、パスワードを変更してください。
    </p>
    <InformationMessage class="mb20" dialog-title="メールが届かない場合">
      <template v-slot:message>
        (１)【メール受信ボックス内】と【迷惑メールフォルダ内】で、
        下記を確認してください。<br />
        ・最新の受信状態に更新する<br />
        ・「●●@ymdy.co.jp」のメールアドレスを検索<br />
        ・「【YAMADAYA】パスワードの再設定をお願い致します。」の件名を検索<br /><br />
        ↓<br />
        (２)それでも見つからない場合<br />
        ・メールを受信出来るように、「@ymdy.co.jp」のドメイン指定をお願いします。<br />
        ・入力間違えがないかご確認の上、再度[新しいメールアドレス]を入力し直してください。<br />
        例1）単語や、1文字が抜けている<br />
        例2）.や-が多く入力されている<br />
        例3）.ne.jpが.co.jpや.comになっている<br />
        例4）小文字が大文字になっている<br />
      </template>
    </InformationMessage>

    <div class="form-actions">
      <ButtonWrapper theme="normal" class-name="mt30">
        <Button theme="light" @click="resend">
          パスワード再設定メールを再送する
        </Button>
      </ButtonWrapper>
    </div>

    <BaseDialog ref="resendDialog" title="" :has-ok="false" :has-cancel="false">
      パスワード再設定メールを再送しました。<br />まだ再設定は完了していません。
    </BaseDialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PageTitle from "@/components/atoms/PageTitle";
import ErrorBox from "@/components/atoms/ErrorBox";
import BaseDialog from "@/components/atoms/BaseDialog";
import InformationMessage from "@/components/molecules/InformationMessage";
import { extractFlatValidationError } from "@/plugins/vee-validate";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";

export default {
  components: {
    PageTitle,
    ErrorBox,
    BaseDialog,
    InformationMessage,
    ButtonWrapper,
    Button,
  },
  auth: "guest",
  data() {
    return {
      error: null,
      hasResent: false,
    };
  },
  computed: {
    ...mapGetters({
      email: "password/email",
      formData: "password/formData",
    }),
  },
  methods: {
    async sendRequest() {
      try {
        if (!(this.formData && this.formData.email)) {
          this.error =
            "セッションが切れました。再度パスワード再設定画面からやり直してください。";
          return;
        }
        await this.$api.store("reset_password", this.formData);
        this.hasResent = true;
        this.$refs.resendDialog.show();
      } catch (error) {
        const errorMessages = extractFlatValidationError(error);
        this.error = errorMessages[0];
      }
    },
    resend() {
      this.sendRequest();
    },
  },
  head() {
    return {
      title: "パスワードの再設定",
    };
  },
};
</script>

<style lang="scss" scoped>
.text {
  font-size: 12px;
}
.email-form-wrapper {
  margin-top: 30px;
}
.btn {
  max-width: 230px;
  margin-left: auto;
  margin-right: auto;
}
.send-text {
  margin-bottom: 20px;
}
.not-arrived {
  vertical-align: middle;
  > img {
    vertical-align: middle;
  }
}
.form-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  > .btn {
    padding: 12px 10px;
    &.cancel {
      color: $white;
      background-color: #6c6c6c;
      border: 1px solid #6c6c6c;
    }
    &.ok {
      border: 1px solid $black;
    }
    + .btn {
      margin-left: 10px;
    }
  }
}
</style>
