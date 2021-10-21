<template>
  <div class="login-container">
    <ValidationObserver v-slot="observer" ref="obs">
      <ErrorBox v-if="error">{{ error }}</ErrorBox>
      <PageTitle>
        会員システムと照合した結果、<br />
        会員コードとPINコードの確認ができました。
      </PageTitle>
      <div class="form-wrapper">
        <div class="form-group">
          <label class="form-label">YMDY Co.LTD MEMBERSCARD ID</label>
          <label class="form-label">{{ cardId }}</label>
        </div>
        <div class="form-group">
          <label class="form-label">PINコード</label>
          <label class="form-label">{{ pinCode }}</label>
        </div>
      </div>
      <p class="fs12 mb20">
        “YAMADAYA会員になるには、受信可能なメールアドレスの登録が必要です。<br />
        下記にメールアドレスを入力してください。”
      </p>
      <div class="form-wrapper">
        <TextField
          id="email"
          vid="email"
          v-model="email"
          type="email"
          name="メールアドレス"
          rules="required|max:255|email"
          label="メールアドレス"
          placeholder="利⽤するメールアドレスを⼊⼒してください"
        />
        <TextField
          id="email_confirm"
          v-model="emailConfirm"
          type="email"
          name="メールアドレス（確認用）"
          rules="required|max:255|confirmed:email"
          label="メールアドレス（確認用）"
          placeholder="利⽤するメールアドレスを⼊⼒してください"
        />
        <div class="form-group">
          <ButtonWrapper theme="normal" class-name="mt30">
            <Button theme="dark" :disabled="observer.invalid" @click="nextStep">
              会員登録を進める：残り2ステップ
            </Button>
          </ButtonWrapper>
        </div>
      </div>
    </ValidationObserver>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
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
    ...mapGetters({
      cardId: "register/old/cardId",
      pinCode: "register/old/pinCode",
    }),
    email: {
      get() {
        return this.$store.state.register.old.email;
      },
      set(value) {
        return this.$store.commit("register/old/setEmail", value);
      },
    },
    emailConfirm: {
      get() {
        return this.$store.state.register.old.emailConfirm;
      },
      set(value) {
        return this.$store.commit("register/old/setEmailConfirm", value);
      },
    },
  },
  methods: {
    async nextStep() {
      try {
        await this.$api.store("old_member/mail_auth/check", {
          email: this.email,
          email_confirm: this.emailConfirm,
          card_id: this.cardId,
          pin: this.pinCode,
        });

        this.$router.push("/register/card/complete");
      } catch (error) {
        const messages = extractFlatValidationError(error);
        this.error = messages[0];
      }
    },
  },
  head() {
    return {
      title: "既存会員引き続き",
    };
  },
};
</script>
