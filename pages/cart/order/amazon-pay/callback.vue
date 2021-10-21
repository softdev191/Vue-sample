<template>
  <div></div>
</template>

<script>
import * as errorCode from "@/constants/amazon-pay/errorCode";
import { isAuthHttpError } from "@/plugins/axios";

export default {
  async created() {
    if (process.server) {
      return;
    }

    await this.initialize();
  },
  methods: {
    async initialize() {
      if (!this.$amazonPay.validateCsrfFromLoggedInRedirectUrl()) {
        this.$router.push("/404");
      }

      if (this.$amazonPay.hasError()) {
        return this.handleError();
      }

      const accessToken = this.$amazonPay.getURLParameter("access_token");

      if (!this.$amazonPay.validateAccessToken(accessToken)) {
        this.$store.commit("setSessionData", {
          lastError: {
            title: "ご購入のお手続きに進めませんでした。",
            message: "Amazonアカウントにログインができませんでした。",
          },
        });

        return this.$router.push("/cart");
      }

      this.$amazonPay.storeAccessToken(accessToken);

      if (!this.$auth.loggedIn) {
        try {
          await this.$amazonPay.login(this.$auth, accessToken);
        } catch (error) {
          console.error(error);

          if (isAuthHttpError(error)) {
            this.$store.commit("setSessionData", {
              lastError: {
                title: "ご購入のお手続きに進めませんでした。",
                message:
                  "Amazonアカウント連携機能をご利用いただくためには、ログインする必要があります。",
              },
            });
            this.$store.commit("route/setRedirectPath", this.$route);

            return this.$router.push("/login");
          }

          this.$store.commit("setSessionData", {
            lastError: {
              title: "ご購入のお手続きに進めませんでした。",
              message: "エラーが発生しました。",
            },
          });

          return this.$router.push("/cart");
        }
      }

      if (!this.$auth.user.is_amazon_linked) {
        try {
          await this.$amazonPay.linkAccount(this.$auth, accessToken);
        } catch (error) {
          console.error(error);

          this.$store.commit("setSessionData", {
            lastError: {
              title: "ご購入のお手続きに進めませんでした。",
              message: "Amazonアカウントとの連携ができませんでした。",
            },
          });

          return this.$router.push("/cart");
        }
      }

      this.$router.push({ name: "cart-order-amazon-pay-info" });
    },
    handleError() {
      const code = this.$amazonPay.getErrorCode();

      // TODO: 必要に応じてメッセージを分ける
      switch (code) {
        case errorCode.ERR_INVALID_SCOPE:
        case errorCode.ERR_UNAUTHORIZED_CLIENT:
        case errorCode.ERR_INVALID_GRANT:
        case errorCode.ERR_ACCESS_DENIED:
        case errorCode.ERR_INVALID_REQUEST:
        case errorCode.ERR_SERVER_ERROR:
        case errorCode.ERR_TEMPORARILY_UNAVAILABLE:
        default:
          this.$store.commit("setSessionData", {
            lastError: "Amazonアカウントにログインができませんでした。",
          });
          this.$router.push("/cart");
      }
    },
  },
};
</script>
