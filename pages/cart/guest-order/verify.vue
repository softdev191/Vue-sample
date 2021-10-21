<template>
  <div></div>
</template>

<script>
import { isUnprocessableEntityError } from "@/plugins/axios";
import { extractFlatValidationError } from "@/plugins/vee-validate";
import { CartCredentialProvider } from "@/plugins/storage-provider/cart-credential";

export default {
  beforeRouteLeave(to, from, next) {
    if (!to.name.match(/^cart-guest-order/)) {
      this.$store.commit("setSessionData", {
        memberToken: null,
        memberId: null,
      });
    }

    next();
  },
  fetchOnServer: false,
  async fetch() {
    const query = this.$route.query;

    try {
      await this.$api.store(`guest_purchase/${query.cart_id}/verify`, {
        cart_token: query.cart_token,
        guest_token: query.guest_token,
        member_id: query.member_id,
      });

      this.$store.commit("setSessionData", {
        memberToken: query.member_token,
        memberId: query.member_id,
      });

      CartCredentialProvider.setCredentials(query.cart_id, query.cart_token);

      this.$router.push("/cart/guest-order");
    } catch (error) {
      if (isUnprocessableEntityError(error)) {
        const messages = extractFlatValidationError(error);

        this.$store.commit("setSessionData", {
          lastError: {
            title: "ご購入のお手続きに進めませんでした。",
            message: messages[0],
          },
        });

        return this.$router.push("/cart");
      }

      this.$router.push("/404");
    }
  },
};
</script>
