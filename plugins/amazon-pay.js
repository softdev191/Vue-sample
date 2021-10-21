import EventEmitter from "events";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import Vue from "vue";

export const EVENT_AMAZON_LOGIN_READY = "EVENT_AMAZON_LOGIN_READY";

const INITIAL_RETRY_WAIT_TIME = 100;
const INITIAL_RETRY_LIMIT = 500;

const AMAZON_REDIRECT_AUTH_CSRF_KEY = "amazon_redirect_auth_csrf_key";
const AMAZON_REDIRECT_AUTH_CSRF_EXPIRE_MIN = 30;
const ACCESS_TOKEN_COOKIE_KEY = "amazon_Login_accessToken";

const amazonPay = {
  isAmazonLoginReady: false,
  accessToken: null,
  events: new EventEmitter(),
  $cookies: null,

  /**
   * SELLER_ID
   */
  get amazonMerchantId() {
    return process.env.amazonMerchantId;
  },

  /**
   * CLIENT_ID
   */
  get amazonStoreId() {
    return process.env.amazonStoreId;
  },

  get amazon() {
    return window.amazon;
  },

  get offAmazonPayments() {
    return window.OffAmazonPayments;
  },

  getURLParameter(name) {
    const source = window.location.hash;

    return (
      decodeURIComponent(
        (new RegExp("[?|&|#]" + name + "=" + "([^&]+?)(&|#|;|$)").exec(
          source
        ) || ["", ""])[1].replace(/\+/g, "%20")
      ) || null
    );
  },

  getAccessToken() {
    if (!this.accessToken) {
      this.accessToken = this.$cookies.get(ACCESS_TOKEN_COOKIE_KEY);
    }

    return this.accessToken;
  },

  storeAccessToken(accessToken) {
    this.accessToken = accessToken;
    this.$cookies.set(ACCESS_TOKEN_COOKIE_KEY, accessToken, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });
  },

  storeCsrfToken(csrfToken) {
    this.$cookies.set(AMAZON_REDIRECT_AUTH_CSRF_KEY, csrfToken, {
      path: "/",
      expires: dayjs()
        .add(AMAZON_REDIRECT_AUTH_CSRF_EXPIRE_MIN, "minute")
        .toDate(),
    });
  },

  generateToken() {
    return uuidv4();
  },

  validateCsrfFromLoggedInRedirectUrl() {
    return (
      this.getURLParameter("state") ===
      this.$cookies.get(AMAZON_REDIRECT_AUTH_CSRF_KEY)
    );
  },

  validateAccessToken(accessToken) {
    return typeof accessToken === "string" && accessToken.match(/^Atza/);
  },

  validateContinuity() {
    return this.accessToken === this.$cookies.get(ACCESS_TOKEN_COOKIE_KEY);
  },

  hasError() {
    return this.getURLParameter("error") !== null;
  },

  getErrorCode() {
    return this.getURLParameter("error");
  },

  async login($auth, accessToken) {
    const response = await this.$api.store("member/auth/amazon", {
      access_token: accessToken,
    });
    await $auth.reset();
    await $auth.setUserToken(response.member_token);
  },

  async linkAccount($auth, accessToken) {
    const response = await this.$api.store("member/auth/amazon/link", {
      access_token: accessToken,
    });
    $auth.setUser(response);
  },

  logout() {
    if (process.server) {
      console.warn("$amazonPay.logout cannot be called on server side.");
      return;
    }

    this.amazon.Login.logout();

    this.$cookies.remove(ACCESS_TOKEN_COOKIE_KEY, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });
  },
};

Vue.set(amazonPay, "isAmazonLoginReady", false);

export default function (context, inject) {
  amazonPay.$cookies = context.$cookies;
  amazonPay.$api = context.$api;

  inject("amazonPay", amazonPay);
}

const initializeAmazon = (retry = 0) => {
  const amazon = window.amazon;

  if (!amazon) {
    if (retry > INITIAL_RETRY_LIMIT) {
      throw new Error("Failed to initialize amazon SDK");
    }

    return setTimeout(() => initializeAmazon(++retry), INITIAL_RETRY_WAIT_TIME);
  }

  amazon.Login.setClientId(amazonPay.amazonStoreId);
  Vue.set(amazonPay, "isAmazonLoginReady", true);
  amazonPay.events.emit(EVENT_AMAZON_LOGIN_READY, amazon);
};

if (process.client) {
  initializeAmazon();
}
