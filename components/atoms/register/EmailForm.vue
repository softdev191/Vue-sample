<template>
  <div class="form-wrapper">
    <form>
      <div class="form-group">
        <label class="form-label" for="email">メールアドレス</label>
        <input
          id="email"
          v-model="email"
          class="form-control"
          type="email"
          name="email"
          placeholder="利⽤するメールアドレスを⼊⼒してください"
        />
      </div>
      <div class="form-group">
        <label class="form-label" for="email_confirmation">
          メールアドレス（確認用）
        </label>
        <input
          id="email_confirmation"
          v-model="emailConfirmation"
          class="form-control"
          type="email"
          name="email_confirmation"
          placeholder="利⽤するメールアドレスを⼊⼒してください"
        />
      </div>
      <p class="form-text">
        メールアドレスが間違っていると、注⽂完了メール、発送メール等がお受け取りになれません。間違いのないように⼊⼒お願いします。
      </p>
      <div class="form-group">
        <button type="button" class="btn inline center mt30" @click="nextStep">
          会員登録を進める：残り2ステップ
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  computed: {
    email: {
      get() {
        return this.$store.state.register.member.email;
      },
      set(value) {
        this.$store.commit("register/member/setEmail", value);
      },
    },
    emailConfirmation: {
      get() {
        return this.$store.state.register.member.emailConfirmation;
      },
      set(value) {
        this.$store.commit("register/member/setEmailConfirmation", value);
      },
    },
  },
  methods: {
    nextStep() {
      this.$emit("next");
    },
  },
};
</script>
