<template>
  <div class="fixed-container">
    <Breadcrumb text="HOME > マイページ > メールアドレス変更" />
    <div class="mypage-layout">
      <SideMenu />
      <div class="mypage-main">
        <PageTitle class="center">
          変更確認メールを{{ hasResent ? "再送" : "送信" }}しました。<br
            class="sp-only"
          />
          まだ変更は完了していません。
        </PageTitle>
        <p class="text">
          入力された新しいメールアドレス宛に、変更確認メールを送信しました。届いたメール内に記載されているURLをクリックして、ページを読み込むと、変更が完了します。
        </p>
        <div class="form-group">
          <ButtonWrapper theme="normal" class-name="mt30">
            <Button theme="light" :pending="pending" @click="resend">
              変更確認メールを再送する
            </Button>
          </ButtonWrapper>
        </div>
        <InformationMessage dialog-title="メールが届かない場合">
          <template v-slot:message>
            (１)【メール受信ボックス内】と【迷惑メールフォルダ内】で、
            下記を確認してください。<br />
            ・最新の受信状態に更新する<br />
            ・「●●@ymdy.co.jp」のメールアドレスを検索<br />
            ・「【YAMADAYA】メールアドレスの変更をお願い致します。」の件名を検索<br /><br />
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
      </div>
    </div>
    <BaseDialog ref="resendDialog" title="" :has-ok="false" :has-cancel="false">
      変更確認メールを再送しました。<br />まだ変更は完了していません。
    </BaseDialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PageTitle from "@/components/atoms/PageTitle";
import Breadcrumb from "@/components/partials/Breadcrumb";
import BaseDialog from "@/components/atoms/BaseDialog";
import SideMenu from "@/components/pages/mypage/SideMenu";
import InformationMessage from "@/components/molecules/InformationMessage";
import { extractFlatValidationError } from "@/plugins/vee-validate";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";

export default {
  components: {
    PageTitle,
    Breadcrumb,
    BaseDialog,
    SideMenu,
    InformationMessage,
    ButtonWrapper,
    Button,
  },
  data() {
    return {
      hasResent: false,
    };
  },
  computed: {
    ...mapGetters({
      email: "member/email/email",
      emailConfirmation: "member/email/emailConfirm",
      pending: "common/pending",
    }),
  },
  methods: {
    async resend() {
      try {
        this.$store.commit("common/pending", true);
        await this.$api.store(`member/${this.$auth.user.id}/change_email`, {
          email: this.email,
          email_confirmation: this.emailConfirmation,
        });
        await this.$auth.fetchUser();
        this.hasResent = true;
        this.$refs.resendDialog.show();
      } catch (error) {
        const messages = extractFlatValidationError(error);
        this.error = messages[0];
      } finally {
        this.$store.commit("common/pending", false);
      }
    },
  },
  head() {
    return {
      title: "メールアドレス変更",
    };
  },
};
</script>

<style lang="scss" scoped>
.page-title {
  font-size: 14px;
  font-weight: 600;
  margin: 25px 0 30px;
  &.center {
    text-align: center;
  }
  @include desktop {
    margin-top: 0;
  }
}
.text {
  font-size: 12px;
  margin-top: 10px;
}
</style>
