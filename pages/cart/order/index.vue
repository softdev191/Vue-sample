<template>
  <OrderProcedureForm />
</template>

<script>
import OrderProcedureForm from "@/components/pages/order/OrderProcedureForm";
import { isAuthHttpError } from "@/plugins/axios";

export default {
  components: {
    OrderProcedureForm,
  },
  beforeRouteEnter(to, from, next) {
    if (!["cart-order-confirm", "cart"].includes(from.name)) {
      return next(false);
    }

    next();
  },
  async asyncData({ store, $auth, redirect }) {
    try {
      await $auth.fetchUser();

      await Promise.all([
        store.dispatch("cart/fetch", {
          params: {
            payment_type: store.getters["order/paymentType"],
            always_create: 0,
          },
        }),
        store.dispatch("memberCreditCard/fetch"),
        store.dispatch("master/fetch"),
        store.dispatch("destination/fetch"),
        store.dispatch("point/fetch", $auth.user.id),
        store.dispatch("billingAddress/fetch"),
      ]);
    } catch (error) {
      if (isAuthHttpError(error)) {
        return redirect("/login");
      }

      throw error;
    } finally {
      store.commit("common/pending", false);
    }
  },
  middleware: "auth",
};
</script>
