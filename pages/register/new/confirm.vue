<template>
  <div class="login-container">
    <PageTitle class="center">
      <div v-if="!hasResent">
        認証メールを送信しました。<br />まだ変更は完了していません。
      </div>
      <div v-else>
        認証メールを再送しました。<br />まだ手続きは完了していません。
      </div>
    </PageTitle>
    <p class="text kome mb20">
      ※入力されたメールアドレス宛に、認証メールを送信しました。届いたメール内に記載されているURLをクリックして、お客様情報の入力を完了させてください。
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
          <Button
            theme="light"
            :disabled="!canResend"
            :pending="pending"
            @click="resend"
          >
            認証メールを再送する
            <template v-if="seconds > 0">({{ seconds }}s)</template>
          </Button>
        </ButtonWrapper>
      </div>
    </div>
    <BaseDialog ref="resendDialog" title="" :has-ok="false" :has-cancel="false">
      認証メールを再送しました。<br />まだ手続きは完了していません。
    </BaseDialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import BaseDialog from "@/components/atoms/BaseDialog";
import PageTitle from "@/components/atoms/PageTitle";
import { extractFlatValidationError } from "@/plugins/vee-validate";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";

export default {
  components: {
    PageTitle,
    BaseDialog,
    ButtonWrapper,
    Button,
  },
  data() {
    return {
      intervalId: null,
      seconds: 5,
      hasResent: false,
    };
  },
  computed: {
    ...mapState({
      email(state, getters) {
        return getters["register/new/email"];
      },
    }),
    canResend() {
      return this.seconds <= 0;
    },
    pending() {
      return this.$store.getters["common/pending"];
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
        this.$store.commit("common/pending", true);
        await this.$api.store("member/store/temp", {
          email: this.email,
        });
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
      title: "ヤマダヤメンバーズ会員登録",
    };
  },
};
</script>

<style lang="scss" scoped>
.page-title {
  @include desktop {
    margin-top: 25px;
  }
}
.register-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: $black;
  padding: 16px 0;
}
</style>
