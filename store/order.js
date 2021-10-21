import Vue from "vue";
import {
  createFormParams,
  createGuestPurchaseFormParams,
} from "@/helpers/order";
import { CartCredentialProvider } from "@/plugins/storage-provider/cart-credential";

export const state = () => ({
  destinationId: null,
  transport: {
    delivery_type: 1,
    delivery_has_time: 0,
    delivery_hope_date: null,
    delivery_hope_time: null,
  },
  paymentType: null,
  cardInfo: {
    cardMaskedPan: null,
    maskedSecurityCode: null,
    cardToken: null,
    cardValidity: null,
    method: null,
    isSaveCardInfo: false,
    useSavedCardInfo: false,
    memberCreditCardId: null,
  },
  // 再編集用に入力情報を一時的に保持するためのデータ。
  // サーバーには送らない。
  cardInputCache: {
    creditNumber: "",
    creditMonth: null,
    creditYear: null,
    cardHolderName: "",
  },
  billingAddress: null,
  pointUsage: {
    use_point_type: null,
    use_point: 0,
  },
  message: {
    hasMessage: 0,
    type: null,
    content: "",
  },
  amazonPayInfo: {
    amazonOrderReferenceId: null,
    amazonAccessToken: null,
    amazonDestination: {
      name: null,
      addressLine1: null,
      addressLine2: null,
      addressLine3: null,
      prefName: null,
      prefId: null,
      postalCode: null,
    },
  },
  order: null,
  error: null,
  guestSihippingAddress: null,
  isGuestOrder: false,
  memberActivateLink: null,
});

export const mutations = {
  setCardInfo: (state, data) => {
    state.cardInfo = data;
  },
  setCardInputCache: (state, data) => {
    state.cardInputCache = data;
  },
  setTransport: (state, param) => {
    state.transport = { ...param };
  },
  setPointUsage: (state, pointUsage) => {
    state.pointUsage = pointUsage;
  },
  setMessage: (state, { content, hasMessage, type }) => {
    Vue.set(state.message, "hasMessage", hasMessage);
    Vue.set(state.message, "content", content);
    Vue.set(state.message, "type", type);
  },
  setBillingAddress: (state, param) => {
    state.billingAddress = param;
  },
  setAmazonPayInfo(state, data) {
    state.amazonPayInfo = data;
  },
  setPaymentType(state, paymentType) {
    state.paymentType = paymentType;
  },
  setDestinationId(state, destinationId) {
    state.destinationId = destinationId;
  },
  resetAll(localState) {
    const newState = state();

    Object.keys(newState).forEach((key) => {
      localState[key] = newState[key];
    });
  },
  setOrder(state, data) {
    state.order = data;
  },
  setGuestSihippingAddress(state, data) {
    state.guestSihippingAddress = data;
  },
  setIsGuestOrder(state, value) {
    state.isGuestOrder = value;
  },
  setMemberActivateLink(state, value) {
    state.memberActivateLink = value;
  },
};

export const actions = {
  async confirmOrder({ commit, getters, dispatch }, params) {
    const paymentTypeKv = getters.paymentTypeKv;

    const data = await (params.payment_type === paymentTypeKv.AmazonPay
      ? this.$api.store("purchase/confirm/amazon_pay", params)
      : this.$api.store("purchase/confirm", params));

    await dispatch("commitOrderResponse", data);
  },

  async confirmGuestOrder({ getters, dispatch }, params) {
    const data = await this.$api.store(
      `guest_purchase/${params.cart_id}/confirm`,
      params
    );

    await dispatch("commitGuestOrderResponse", data);
  },

  async create({ commit, dispatch }, { params }) {
    const data = await this.$api.store("purchase", params);

    await dispatch("commitOrderResponse", data);

    commit("setOrder", data.order);

    CartCredentialProvider.setCredentials(
      data.new_cart.id,
      data.new_cart.token
    );
  },

  async createGuestOrder({ commit, dispatch }, { params }) {
    const data = await this.$api.store(
      `guest_purchase/${params.cart_id}/order`,
      params
    );

    await dispatch("commitGuestOrderResponse", data);

    commit("setOrder", data.order);

    commit("setMemberActivateLink", data.member_activate_link);

    CartCredentialProvider.setCredentials(
      data.new_cart.id,
      data.new_cart.token
    );
  },

  commitOrderResponse({ commit, getters }, data) {
    const paymentTypeKv = getters.paymentTypeKv;

    commit("setPointUsage", {
      use_point: data.use_point,
      use_point_type: data.use_point_type,
    });
    commit("setTransport", {
      delivery_type: data.delivery_type,
      delivery_has_time: data.delivery_has_time,
      delivery_hope_date: data.delivery_hope_date,
      delivery_hope_time: data.delivery_hope_time,
    });

    commit(
      "setMessage",
      Object.assign({}, data.message || {}, {
        hasMessage: data.has_message,
      })
    );

    commit("setPaymentType", data.payment_type);
    commit("setDestinationId", data.destination_id);

    if (data.payment_type === paymentTypeKv.CreditCard) {
      commit("setCardInfo", {
        cardMaskedPan: data.card.masked_pan,
        cardToken: data.card.token,
        cardValidity: data.card.validity,
        method: data.card.payment_method,
        isSaveCardInfo: data.card.is_save_card_info,
        maskedSecurityCode: data.card.masked_security_code,
        useSavedCardInfo: data.card.use_saved_card_info,
        memberCreditCardId: data.card.member_credit_card_id,
      });

      commit("setBillingAddress", data.billing_address);
    } else if (data.payment_type === paymentTypeKv.AmazonPay) {
      commit("setAmazonPayInfo", {
        amazonOrderReferenceId: data.amazon_order_reference_id,
        amazonAccessToken: data.amazon_access_token,
        amazonDestination: data.amazon_destination,
      });
    }

    commit("cart/setCartFromResponse", data.cart_data, { root: true });
  },

  commitGuestOrderResponse({ commit, getters }, data) {
    commit("setTransport", {
      delivery_type: data.delivery_type,
      delivery_has_time: data.delivery_has_time,
      delivery_hope_date: data.delivery_hope_date,
      delivery_hope_time: data.delivery_hope_time,
    });

    commit(
      "setMessage",
      Object.assign({}, data.message || {}, {
        hasMessage: data.has_message,
      })
    );

    commit("setPaymentType", data.payment_type);

    const shippingAddress = { ...data.shipping_address };

    if (data.member) {
      shippingAddress.email = data.member.email;
    }

    commit("setGuestSihippingAddress", shippingAddress);

    commit("setIsGuestOrder", true);

    commit("setCardInfo", {
      cardMaskedPan: data.card.masked_pan,
      cardToken: data.card.token,
      cardValidity: data.card.validity,
      method: data.card.payment_method,
      isSaveCardInfo: data.card.is_save_card_info,
      maskedSecurityCode: data.card.masked_security_code,
      useSavedCardInfo: 0,
      memberCreditCardId: null,
    });

    commit("cart/setCartFromResponse", data.cart_data, { root: true });
  },
};

export const getters = {
  destinationId: ({ destinationId }) => destinationId,
  defaultDestinationId: (state, { destinationId }, rootState, rootGetters) => {
    if (destinationId !== null) {
      return destinationId;
    }

    const destinations = rootGetters["destination/destinations"];

    if ((destinations || []).length > 0) {
      return destinations[0].id;
    }

    return null;
  },
  transport: (state) => {
    return state.transport;
  },
  pointUsage: (state) => {
    return state.pointUsage;
  },
  message: (state) => {
    return state.message;
  },
  messageHasMessage: (state) => {
    return state.message.hasMessage;
  },
  messageType: (state) => {
    return state.message.type;
  },
  messageContent: (state) => {
    return state.message.content;
  },
  paymentType: (state) => {
    return state.paymentType;
  },
  cardMaskedPan: (state) => {
    return state.cardInfo.cardMaskedPan;
  },
  securityCode: (state) => {
    return state.cardInfo.securityCode;
  },
  maskedSecurityCode: (state) => {
    return state.cardInfo.maskedSecurityCode;
  },
  paymentMethod: (state) => {
    return state.cardInfo.method;
  },
  cardToken: (state) => {
    return state.cardInfo.cardToken;
  },
  cardValidity: (state) => {
    return state.cardInfo.cardValidity;
  },
  billingAddress: (state) => {
    return state.billingAddress;
  },
  activeBillingAddress: (state, getters, rootState, rootGetters) => {
    return getters.billingAddress
      ? getters.billingAddress
      : rootGetters["billingAddress/findOne"];
  },
  cardInfo: ({ cardInfo }) => cardInfo,
  cardInputCache: ({ cardInputCache }) => cardInputCache,
  paymentTypeKv: (state, getters, rootState, rootGetters) =>
    rootGetters["enum/kv"].order__payment_type || {},
  usePointTypeKv: (state, getters, rootState, rootGetters) =>
    rootGetters["enum/kv"].order__use_point_type || {},
  errorCodeKv: (state, getters, rootState, rootGetters) =>
    rootGetters["enum/kv"].common__error_code || {},
  usePointTypeOptions: (state, getters, rootState, rootGetters) =>
    rootGetters["enum/options"].order__use_point_type || {},
  amazonDestination: ({ amazonPayInfo }) =>
    amazonPayInfo && amazonPayInfo.amazonDestination,
  usablePoints: (state, getters, rootState, rootGetters) =>
    rootGetters["point/amount"],
  paymentMethodOptions: (state, getters, rootState, rootGetters) => {
    return rootGetters["enum/options"].order__payment_method || {};
  },
  guestSihippingAddress: ({ guestSihippingAddress }) => guestSihippingAddress,
  order: ({ order }) => order,
  confirmedFormData: (state, getters, rootState, rootGetters) => {
    const user = rootGetters.user;
    const paymentTypeKv = getters.paymentTypeKv;
    const usePointTypeKv = getters.usePointTypeKv;
    const usablePoints = getters.usablePoints;
    const cart = rootGetters["cart/cart"];

    return createFormParams(
      state,
      user,
      cart,
      paymentTypeKv,
      usePointTypeKv,
      usablePoints
    );
  },

  confirmedGuestFormData: (state, getters, rootState, rootGetters) => {
    return createGuestPurchaseFormParams(
      Object.assign({}, state, {
        shippingAddress: state.guestSihippingAddress,
      }),
      rootGetters
    );
  },

  isGuestOrder: ({ isGuestOrder }) => isGuestOrder,
  memberActivateLink: ({ memberActivateLink }) => memberActivateLink,
};
