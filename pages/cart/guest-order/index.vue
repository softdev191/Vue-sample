<template>
  <OrderProcedureForm
    :progress-percent-per-item="22.5"
    :form-type="FORM_TYPE_GUEST"
  >
    <template
      #formSections="{
        inputs,
        localCardInputCache,
        handleUpdateDestination,
        handleUpdateTransportValidation,
        handleUpdatePaymentValidation,
        handleUpdateMessageValidation,
      }"
    >
      <GuestOrderAddressSection
        title="1. お届け先"
        :inputs="inputs.shippingAddress"
        @update:validation="handleUpdateDestination"
      />
      <OrderTransportSection
        title="2. 配送方法と時間"
        class="bg"
        :inputs="inputs.transport"
        @update:validation="handleUpdateTransportValidation"
      />
      <GuestOrderPaymentSection
        title="3. お支払い方法"
        :card-info.sync="inputs.cardInfo"
        :card-input-cache="localCardInputCache"
        @update:validation="handleUpdatePaymentValidation"
      />
      <OrderMessageSection
        title="4. ご要望"
        class="bg"
        :inputs="inputs.message"
        @update:validation="handleUpdateMessageValidation"
      />
    </template>
  </OrderProcedureForm>
</template>

<script>
import OrderProcedureForm, {
  FORM_TYPE_GUEST,
} from "@/components/pages/order/OrderProcedureForm";
import GuestOrderAddressSection from "@/components/pages/order/GuestOrderAddressSection";
import OrderTransportSection from "@/components/pages/order/OrderTransportSection";
import GuestOrderPaymentSection from "@/components/pages/order/GuestOrderPaymentSection";
import OrderMessageSection from "@/components/pages/order/OrderMessageSection";
import * as httpStatusCode from "@/constants/httpStatusCode";
import { isAuthHttpError, isNotFoundError } from "~/plugins/axios";

export default {
  components: {
    OrderProcedureForm,
    GuestOrderAddressSection,
    OrderTransportSection,
    GuestOrderPaymentSection,
    OrderMessageSection,
  },
  beforeRouteEnter(to, from, next) {
    if (
      !["cart-guest-order-verify", "cart-guest-order-confirm"].includes(
        from.name
      ) &&
      from.name !== null
    ) {
      return next(false);
    }

    next();
  },
  beforeRouteLeave(to, from, next) {
    if (!to.name.match(/^cart-guest-order/)) {
      this.$store.commit("setSessionData", {
        memberToken: null,
        memberId: null,
      });
    }

    next();
  },
  async asyncData({ store, error }) {
    await Promise.all([
      store.dispatch("master/fetch"),
      store
        .dispatch("cart/fetch", {
          params: {
            payment_type: store.getters["order/paymentType"],
            always_create: 0,
          },
        })
        .catch((localError) => {
          if (isAuthHttpError(localError) || isNotFoundError(localError)) {
            error({ statusCode: httpStatusCode.NOT_FOUND });
          }
          error({ statusCode: httpStatusCode.INTERNAL_SERVER_ERROR });
        }),
    ]);
  },
  data() {
    return {
      FORM_TYPE_GUEST,
    };
  },
};
</script>
