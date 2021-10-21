<template>
  <div id="amazon_pay_button"></div>
</template>

<script>
import { EVENT_AMAZON_LOGIN_READY } from "@/plugins/amazon-pay";

/**
 * @see https://developer.amazon.com/ja/docs/amazon-pay-onetime/button-widgets.html
 */
export default {
  name: "AmazonPayButton",
  props: {
    type: {
      type: String,
      default: "PwA",
    },
    color: {
      type: String,
      default: "LightGray",
    },
    pcSize: {
      type: String,
      default: "large",
    },
    spSize: {
      type: String,
      default: "medium",
    },
  },
  data() {
    return {
      authRequest: null,
      loginOptions: {
        scope: "profile postal_code payments:widget payments:shipping_address",
        popup: false,
        interactive: "always",
      },
    };
  },
  computed: {
    redirectUrl() {
      return `${process.env.baseUrl}/cart/order/amazon-pay/callback`;
    },
  },
  async mounted() {
    if (!this.$amazonPay.isAmazonLoginReady) {
      await new Promise((resolve) =>
        this.$amazonPay.events.once(EVENT_AMAZON_LOGIN_READY, resolve)
      );
    }

    this.showButton();
  },
  methods: {
    showButton() {
      const offAmazonPayments = this.$amazonPay.offAmazonPayments;
      const size = this.$device.isDesktop ? this.pcSize : this.spSize;

      offAmazonPayments.Button(
        "amazon_pay_button",
        this.$amazonPay.amazonMerchantId,
        {
          size,
          type: this.type,
          color: this.color,
          authorization: () => {
            const amazon = this.$amazonPay.amazon;
            const options = { ...this.loginOptions };

            const csrfToken = this.$amazonPay.generateToken();
            this.$amazonPay.storeCsrfToken(csrfToken);
            options.state = csrfToken;

            this.authRequest = amazon.Login.authorize(
              options,
              this.redirectUrl
            );
          },
          onError(error) {
            console.error(error);
          },
        }
      );
    },
  },
};
</script>
