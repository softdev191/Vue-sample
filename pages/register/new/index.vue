<template>
  <div class="login-container">
    <ErrorBox v-if="error" title="もう一度お試しください">
      {{ error }}
    </ErrorBox>
    <ValidationObserver v-slot="{ invalid }" ref="obs">
      <PageTitle>新規会員登録手続き</PageTitle>
      <p class="fs12 mb20">
        YAMADAYA会員になるには、受信可能なメールアドレスの登録が必要です。下記にメールアドレスを入力してください。
      </p>
      <p class="fs12 mb30">
        このページで入力された情報は暗号化され、安全な状態で送信されます。
      </p>
      <div class="form-wrapper">
        <form>
          <TextField
            id="email"
            vid="email"
            v-model="email"
            type="email"
            name="メール"
            rules="required|email"
            label="メールアドレス"
            placeholder="利⽤するメールアドレスを⼊⼒してください"
          />
          <TextField
            id="email_confirmation"
            v-model="emailConfirmation"
            type="email"
            name="メールアドレス（確認用）"
            rules="required|email|confirmed:email"
            label="メールアドレス（確認用）"
            placeholder="利⽤するメールアドレスを⼊⼒してください"
          />
          <div class="form-group">
            <ButtonWrapper theme="normal" class-name="mt30">
              <Button
                theme="dark"
                :disabled="invalid"
                :pending="pending"
                @click="nextStep"
              >
                会員登録を進める：残り2ステップ
              </Button>
            </ButtonWrapper>
          </div>
        </form>
      </div>
    </ValidationObserver>
  </div>
</template>

<script>
import ErrorBox from "@/components/atoms/ErrorBox";
import PageTitle from "@/components/atoms/PageTitle";
import TextField from "@/components/atoms/TextField";
import { extractFlatValidationError } from "@/plugins/vee-validate";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";

export default {
  components: {
    ErrorBox,
    PageTitle,
    TextField,
    ButtonWrapper,
    Button,
  },
  data() {
    return {
      error: null,
    };
  },
  computed: {
    email: {
      get() {
        return this.$store.state.register.new.email;
      },
      set(value) {
        return this.$store.commit("register/new/setEmail", value);
      },
    },
    emailConfirmation: {
      get() {
        return this.$store.state.register.new.emailConfirmation;
      },
      set(value) {
        return this.$store.commit("register/new/setEmailConfirmation", value);
      },
    },
    pending() {
      return this.$store.getters["common/pending"];
    },
  },
  methods: {
    async nextStep() {
      try {
        this.$store.commit("common/pending", true);
        await this.$api.store("member/store/temp", { email: this.email });
        this.$router.push("/register/new/confirm");
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
