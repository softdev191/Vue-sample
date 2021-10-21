<template>
  <div class="login-container">
    <ValidationObserver v-slot="observer" ref="obs">
      <ErrorBox v-if="error">{{ error }}</ErrorBox>
      <PageTitle>受信可能なメールアドレスの入力</PageTitle>
      <p class="fs12 mb20">
        受注情報を送信するための受信可能なメールアドレスを入力してください。<br />
        入力されたメールアドレス宛に送信されたメール内のURLより、購入手続きに進むことが可能です。
      </p>
      <div class="form-wrapper">
        <TextField
          id="email"
          v-model="inputs.email"
          vid="email"
          type="email"
          name="メールアドレス"
          rules="required|max:255|email"
          label="メールアドレス"
          placeholder="利⽤するメールアドレスを⼊⼒してください"
        />
        <TextField
          id="email_confirmation"
          v-model="inputs.emailConfirmation"
          type="email"
          name="メールアドレス（確認用）"
          rules="required|max:255|confirmed:email"
          label="メールアドレス（確認用）"
          placeholder="利⽤するメールアドレスを⼊⼒してください"
        />
        <div class="form-group">
          <ButtonWrapper theme="normal" class-name="mt30">
            <Button
              theme="dark"
              :disabled="observer.invalid || pending"
              @click="handleSendEmail"
            >
              メールを送る
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
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";
import { extractFlatValidationError } from "@/plugins/vee-validate";
import { CartCredentialProvider } from "@/plugins/storage-provider/cart-credential";
import { isUnprocessableEntityError } from "~/plugins/axios";

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
      pending: false,
      inputs: {
        email: null,
        emailConfirmation: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      enumKv: "enum/kv",
    }),
    errorCodeKv() {
      return this.enumKv.common__error_code || {};
    },
  },
  methods: {
    async handleSendEmail() {
      if (this.pending) {
        return;
      }

      try {
        this.pending = true;
        const { cartId, token } = CartCredentialProvider.getCredentials();

        await this.$api.store(`guest_purchase/${cartId}/email_auth`, {
          email: this.inputs.email,
          email_confirmation: this.inputs.emailConfirmation,
          token,
        });

        this.$store.commit("setSessionData", {
          guestOrderEmail: this.inputs.email,
        });
        this.$router.push("/cart/guest-order/email-complete");
      } catch (error) {
        if (isUnprocessableEntityError(error)) {
          if (error.response.data.code === this.errorCodeKv.EmailAlreadyInUse) {
            this.$store.commit("setSessionData", {
              lastError: {
                title: "ログインをしてください。",
                message:
                  "入力されたメールアドレスはすでに登録されています。ログインをしてから購入手続きにお進みください。",
              },
            });
            this.$store.commit("route/setRedirectPath", { name: "cart" });
            this.$router.push("/login");
            return;
          }
        }

        const messages = extractFlatValidationError(error);
        this.error = messages[0];
      } finally {
        this.pending = false;
      }
    },
  },
  head() {
    return {
      title: "受信可能なメールアドレスの入力",
    };
  },
};
</script>

<style lang="scss" scoped>
.page-title {
  margin: 25px 0 30px;
}
</style>
