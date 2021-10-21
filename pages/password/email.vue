<template>
  <div class="fixed-container">
    <ErrorBox v-if="error">{{ error }}</ErrorBox>
    <PageTitle>パスワードの再設定</PageTitle>
    <p class="text">
      アカウントに登録しているメールアドレス、生年月日を入力してください。
    </p>
    <ValidationObserver
      v-slot="observer"
      ref="obs"
      class="email-form-wrapper"
      tag="div"
    >
      <form class="email-form">
        <TextField
          id="email"
          v-model="email"
          type="email"
          name="メールアドレス"
          rules="required|email"
          label="登録しているメールアドレス"
          placeholder="メールアドレスを入力してください"
        />
        <div class="form-group mb30">
          <label class="form-label" for="birthday">
            登録している⽣年⽉⽇
          </label>
          <DateSelect id="birthday" v-model="birthday" format="YYYY-MM-DD" />
        </div>
        <div class="form-group">
          <ButtonWrapper theme="normal" class-name="mt30">
            <Button
              theme="dark"
              :disabled="observer.invalid"
              @click="sendRequest"
            >
              パスワード再設定メールを送る
            </Button>
          </ButtonWrapper>
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PageTitle from "@/components/atoms/PageTitle";
import DateSelect from "@/components/atoms/DateSelect";
import ErrorBox from "@/components/atoms/ErrorBox";
import TextField from "@/components/atoms/TextField";
import { extractFlatValidationError } from "@/plugins/vee-validate";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";

export default {
  components: {
    PageTitle,
    ErrorBox,
    DateSelect,
    TextField,
    ButtonWrapper,
    Button,
  },
  auth: "guest",
  data() {
    return {
      error: null,
    };
  },
  computed: {
    ...mapGetters({
      formData: "password/formData",
    }),
    email: {
      get() {
        return this.$store.state.password.email;
      },
      set(value) {
        return this.$store.commit("password/setEmail", value);
      },
    },
    birthday: {
      get() {
        return this.$store.state.password.birthday;
      },
      set(value) {
        return this.$store.commit("password/setBirthday", value);
      },
    },
    hasError() {
      return this.error !== undefined;
    },
  },
  methods: {
    async sendRequest() {
      try {
        await this.$api.store("reset_password", this.formData);

        this.$router.push("/password/complete");
      } catch (error) {
        const errorMessages = extractFlatValidationError(error);
        this.error = errorMessages[0];
      }
    },
    resend() {
      this.$refs.completeDialog.hide();
      this.sendRequest();
    },
    gotoTop() {
      this.$refs.completeDialog.hide();
      this.$router.push("/");
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
.send-text {
  margin-bottom: 20px;
}
.not-arrived {
  vertical-align: middle;
  > img {
    vertical-align: middle;
  }
}
</style>
