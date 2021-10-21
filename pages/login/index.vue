<template>
  <div class="login-container">
    <ValidationObserver v-slot="observer" ref="obs">
      <ErrorBox v-if="localError" :title="localError.title">{{
        localError.message
      }}</ErrorBox>
      <ErrorBox v-if="lastErrorMessage" :title="lastErrorTitle">
        {{ lastErrorMessage }}
      </ErrorBox>
      <div class="text-box">
        <NuxtLink to="/transfer" class="members-link">
          新YAMADAYA会員へのご移行が
          <br class="sp-only" />
          お済みでないお客様はこちら&nbsp;
          <fa :icon="faChevronRight" />
        </NuxtLink>
      </div>
      <div class="login-form-wrapper">
        <p class="form-title">ログイン</p>
        <form class="login-form">
          <TextField
            id="email"
            v-model="email"
            type="email"
            name="メール"
            rules="required|email"
            label="メールアドレス"
            placeholder="メールアドレスを入力してください"
          />
          <Password
            id="password"
            v-model="password"
            class="form-group"
            :input-class="['form-control password']"
          />
          <div class="form-group">
            <input
              id="remeber"
              v-model="remember"
              type="checkbox"
              name="remember"
              class="form-checkbox"
            />
            <label for="remeber">ログイン状態を保持する</label>
          </div>
          <div class="form-group">
            <ButtonWrapper theme="full" class-name="mt30">
              <Button
                theme="dark"
                :disabled="observer.invalid"
                :pending="pending"
                @click="login"
              >
                ログインする
              </Button>
            </ButtonWrapper>
          </div>
          <div class="form-group forget-wrapper">
            <NuxtLink to="/password/email" class="forget">
              パスワードをお忘れですか？
              <fa :icon="faChevronRight" />
            </NuxtLink>
          </div>
        </form>
        <p class="form-title">新規会員登録</p>
        <p class="register-text">
          YAMADAYA会員（無料）になると、オンラインストアで予約商品・取り寄せ商品の注文ができたり、ポイントを貯めて・利用する事もできます。
          また会員様限定のセールイベントへの招待、誕生日ポイントのプレゼント等もしています。その他にも会員様だけが利用出来る機能などありますので会員登録がおすすめです。
        </p>
        <ButtonWrapper theme="full">
          <Button theme="dark" @click="register">新規会員登録する</Button>
        </ButtonWrapper>
      </div>
    </ValidationObserver>
  </div>
</template>

<script>
import ErrorBox from "@/components/atoms/ErrorBox";
import Password from "@/components/atoms/Password";
import TextField from "@/components/atoms/TextField";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { extractFlatValidationError } from "@/plugins/vee-validate";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";

export default {
  components: {
    ErrorBox,
    Password,
    TextField,
    ButtonWrapper,
    Button,
  },
  auth: "guest",
  data() {
    return {
      email: "",
      password: "",
      remember: false,
      localError: null,
    };
  },
  computed: {
    faChevronRight() {
      return faChevronRight;
    },
    formData() {
      return {
        email: this.email,
        password: this.password,
        keep_login: this.remember,
      };
    },
    lastError() {
      return this.$store.getters.sessionData.lastError || {};
    },
    lastErrorMessage() {
      return this.lastError.message || "";
    },
    lastErrorTitle() {
      return this.lastError.title || "エラーが発生しました。";
    },
    redirectUri() {
      return this.$store.getters["route/redirectPath"];
    },
    pending() {
      return this.$store.getters["common/pending"];
    },
  },
  created() {
    this.localError = this.$cookies.get("lastError");
    this.$cookies.remove("lastError");
  },
  methods: {
    async login() {
      try {
        this.$store.commit("common/pending", true);
        await this.$auth.loginWith("local", {
          data: this.formData,
        });

        if (this.redirectUri) {
          this.$router.push(this.redirectUri);
          this.$store.commit("route/setRedirectPath", "");
        } else {
          const authRedirectUri = this.$cookies.get("auth.redirect");

          if (authRedirectUri) {
            this.$router.push(authRedirectUri);
          } else {
            this.$router.push({
              path: "/mypage",
              query: { result: "LoginSuccess" },
            });
          }
        }
      } catch (error) {
        const messages = extractFlatValidationError(error);

        if (error.response.data.code === "MemberNotTransferred") {
          this.$store.commit("transfer/setEmail", this.email);
          this.$store.commit("setSessionData", {
            lastError: {
              message: messages[0],
            },
          });
          this.$router.push("/transfer");
        } else {
          this.localError = { message: messages[0] };
        }
      } finally {
        this.$store.commit("common/pending", false);
      }
    },
    register() {
      this.$router.push("/register");
    },
  },
  head() {
    return {
      title: "ログイン",
    };
  },
};
</script>

<style lang="scss" scoped>
.text-box {
  text-align: center;
  background-color: #dbdbdb;
  border: 1px solid $black;
  color: $black;
  padding: 4px 12px;
  margin-top: 30px;
  @include touch {
    padding: 10px 12px;
    margin-top: 20px;
  }
}
.members-link {
  color: $black;
  font-size: 12px;
  line-height: 22px;
}
.login-form-wrapper {
  margin: 50px 0;
  .login-form {
    margin-bottom: 50px;
  }
}
.form-title {
  color: $black;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 30px;
}
.forget-wrapper {
  text-align: right;
  .forget {
    color: $black;
    font-size: 12px;
    border-bottom: 1px solid $black;
  }
}
.register-text {
  color: $black;
  font-size: 12px;
  margin-bottom: 24px;
  @include desktop {
    margin-bottom: 30px;
  }
}
</style>
