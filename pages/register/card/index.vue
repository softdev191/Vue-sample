<template>
  <div class="login-container">
    <ValidationObserver v-slot="observer" ref="obs">
      <ErrorBox v-if="error">{{ error }}</ErrorBox>
      <PageTitle>お持ちの方は、会員カードとの紐づけが必要です。</PageTitle>
      <p class="fs12 mb20">
        会員カードの登録情報・ポイントと紐づけてYAMADAYA会員登録を行います。<br />
        会員カードに記載している「会員コード」と「PINコード」を入力してください。
      </p>
      <p class="fs12 mb30">
        このページで入力された情報は暗号化され、安全な状態で送信されます。
      </p>
      <p class="page-sub-title">会員カードをお持ちのお客様</p>
      <CardImage />
      <div class="form-wrapper">
        <TextField
          id="card_id"
          v-model="cardId"
          name="MEMBERSCARD ID"
          rules="required"
          label="YMDY Co.LTD MEMBERSCARD ID"
          placeholder="会員コードを⼊⼒してください"
        />
        <TextField
          id="pin_code"
          v-model="pinCode"
          name="PINコード"
          rules="required|length:4"
          label="PINコード"
          placeholder="4桁のPINコードを⼊⼒してください"
        />
        <div class="form-group">
          <ButtonWrapper theme="normal" class-name="mt30">
            <Button theme="dark" :disabled="observer.invalid" @click="nextStep">
              IDを照合する
            </Button>
          </ButtonWrapper>
        </div>
      </div>
    </ValidationObserver>
  </div>
</template>

<script>
import ErrorBox from "@/components/atoms/ErrorBox";
import PageTitle from "@/components/atoms/PageTitle";
import CardImage from "@/components/atoms/register/CardImage";
import TextField from "@/components/atoms/TextField";
import { extractFlatValidationError } from "@/plugins/vee-validate";
import { CONFLICT } from "@/constants/httpStatusCode";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";

export default {
  components: {
    ErrorBox,
    PageTitle,
    CardImage,
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
    cardId: {
      get() {
        return this.$store.state.register.old.cardId;
      },
      set(value) {
        return this.$store.commit("register/old/setCardId", value);
      },
    },
    pinCode: {
      get() {
        return this.$store.state.register.old.pinCode;
      },
      set(value) {
        return this.$store.commit("register/old/setPinCode", value);
      },
    },
  },
  methods: {
    async nextStep() {
      try {
        await this.$api.store("old_member/auth/pin", {
          card_id: this.cardId,
          pin_code: this.pinCode,
        });

        this.$router.push("/register/card/email");
      } catch (error) {
        const messages = extractFlatValidationError(error);

        if (error.response.status === CONFLICT) {
          this.$store.commit("setSessionData", {
            lastError: {
              message: messages[0],
            },
          });
          this.$router.push("/login");
        } else {
          this.error = messages[0];
        }
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
