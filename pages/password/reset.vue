<template>
  <div class="fixed-container">
    <CompleteMessage v-if="isComplete" class="complete">
      <template #title>パスワード再設定が完了しました。</template>
      <template #body>
        <p class="mb50">新しいパスワードでログインを行ってください。</p>
        <Button theme="light" @click="login">ログインに進む</Button>
      </template>
    </CompleteMessage>
    <template v-else>
      <ErrorBox v-if="error">{{ error }}</ErrorBox>
      <div class="page-title">パスワードの再設定</div>
      <ValidationObserver
        v-slot="observer"
        ref="obs"
        tag="div"
        class="form-wrapper"
      >
        <form class="reset-form">
          <Password
            id="password"
            v-model="password"
            class="form-group"
            label="新しいパスワード"
          />
          <Password
            id="password_confirmation"
            v-model="passwordConfirmation"
            class="form-group"
            label="新しいパスワード（確認用）"
            :info-text="false"
            rules="required|min:8|password|need_alpha_num|confirmed:password"
          />
          <div class="form-group">
            <Button theme="dark" :disabled="observer.invalid" @click="reset"
              >パスワードを再設定する</Button
            >
          </div>
        </form>
      </ValidationObserver>
    </template>
  </div>
</template>

<script>
import Button from "@/components/atoms/Button";
import ErrorBox from "@/components/atoms/ErrorBox";
import Password from "@/components/atoms/Password";
import CompleteMessage from "@/components/molecules/CompleteMessage";
import { extractFlatValidationError } from "@/plugins/vee-validate";

export default {
  components: {
    Button,
    ErrorBox,
    Password,
    CompleteMessage,
  },
  data() {
    return {
      isComplete: false,
      error: null,
      password: undefined,
      passwordConfirmation: undefined,
    };
  },
  methods: {
    async reset() {
      try {
        await this.$api.store("reset_password_decision", {
          member_id: this.$route.query.member_id,
          member_token: this.$route.query.member_token,
          password: this.password,
          password_confirmation: this.passwordConfirmation,
        });

        this.isComplete = true;
      } catch (error) {
        const messages = extractFlatValidationError(error);
        this.error = messages[0];
      }
    },
    login() {
      this.$router.push("/login");
    },
  },
  head() {
    return {
      title: "パスワードの再設定",
    };
  },
};
</script>
