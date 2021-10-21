import Vue from "vue";
import { createDict } from "@/utils/object";
import { CartCredentialProvider } from "@/plugins/storage-provider/cart-credential";
import dayjs from "dayjs";

const PRE_ORDER = 2;
const ORDER_TYPE = {
  RESERVE: "Reserve",
  BACK_ORDER: "BackOrder",
};

export const state = () => ({
  cart: {
    id: 0,
    token: null,
    products: [],
    order: {
      products_cost: 0,
      campaign_reduce: 0,
      coupon_discount: 0,
      employee_discount: 0,
      payment_fee: 0,
      transfer_cost: 0,
    },
    totalCost: 0,
    points: 0,
    useCoupons: [],
    order_type: 1,
    is_pre_order: false,
  },
  availableCoupons: [],
});

const extractProducts = ({ items }) => {
  return items
    .map((item) => {
      return {
        id: item.id,
        item_detail_id: item.item_detail_id,
        cart_item_id: item.cart_item_id,
        image_url: item.image_url,
        brand: item.brand.name,
        title: item.name,
        product_number: item.product_number,
        color_id: item.color.id,
        color: item.color.display_name,
        size_id: item.size.id,
        status: item.status.value,
        size: item.size.name,
        closed_market_id: item.closed_market_id,
        retail_price: item.retail_price,
        displayed_sale_price: item.displayed_sale_price,
        bundle_sale_price: item.bundle_sale_price,
        can_display_original_price: item.can_display_original_price,
        price_before_order: item.price_before_order,
        cart_original_price: item.cart_original_price,
        count: item.count,
        valid_time: item.valid_time,
        is_pre_order: Number(item.status.value) === PRE_ORDER,
        is_reservation: item.is_reservation,
        applied_reservation: item.applied_reservation,
        expired: item.expired,
        invalid: item.invalid,
        lapsed: item.lapsed,
        invalid_reason: item.invalid_reason,
        posted_at: dayjs(item.posted_at),
      };
    })
    .sort((i1, i2) => i2.posted_at.unix() - i1.posted_at.unix());
};

const extractOrder = (response) => ({
  products_cost: response.items_total,
  campaign_reduce: response.campaign_discount,
  coupon_discount: response.coupon_discount,
  employee_discount: response.employee_discount,
  transfer_cost: response.discounted_postage,
  payment_fee: response.payment_fee,
});

const extractCartSubInfo = (response) => ({
  id: response.id,
  token: response.token,
  totalCost: response.total_price,
  points: response.point,
  order_type: response.order_type,
  useCoupons: response.use_coupons,
  disabledItemDetails: response.disabled_item_details,
});

const extractCart = (response) => {
  const cart = extractCartSubInfo(response);
  const products = extractProducts(response);
  const order = extractOrder(response);

  cart.products = products;
  cart.order = order;

  return cart;
};

const mergeProducts = (oldProducts, newProducts, removingIds = []) => {
  const newProductDict = newProducts.reduce(
    (dict, product) => ({
      ...dict,
      [product.cart_item_id]: true,
    }),
    {}
  );
  const preservedProducts = oldProducts.filter(
    (product) =>
      !removingIds.includes(product.cart_item_id) &&
      !newProductDict[product.cart_item_id]
  );
  return newProducts
    .concat(preservedProducts)
    .sort((i1, i2) => i2.posted_at.unix() - i1.posted_at.unix());
};

const commitUpdateCartResponse = (
  response,
  commit,
  state,
  removingIds = []
) => {
  const cart = extractCart(response);
  cart.products = mergeProducts(
    state.cart.products,
    cart.products,
    removingIds
  );
  commit("setCart", cart);
  commit("setAvailableCoupons", response.available_coupons);
};

export const mutations = {
  setCartFromResponse(state, response) {
    const cart = extractCartSubInfo(response);
    const products = extractProducts(response);
    const order = extractOrder(response);

    cart.products = products;
    cart.order = order;

    state.cart = cart;
    state.availableCoupons = response.available_coupons;
  },
  setProducts(state, data) {
    Vue.set(state.cart, "products", data);
  },
  setOrder(state, data) {
    Vue.set(state.cart, "order", data.order);
  },
  patchCart(state, data) {
    Object.keys(data).forEach((key) => {
      Vue.set(state.cart, key, data[key]);
    });
  },
  setCart(state, data) {
    state.cart = data;
  },
  removeProduct(state, cartItemId) {
    const index = state.cart.products.findIndex(
      (product) => Number(product.cart_item_id) === Number(cartItemId)
    );

    if (index < 0) {
      return;
    }

    state.cart.products.splice(index, 1);
  },
  setAvailableCoupons(state, data) {
    state.availableCoupons = data;
  },
  resetAll(localState) {
    const newState = state();

    Object.keys(newState).forEach((key) => {
      localState[key] = newState[key];
    });
  },
};
export const actions = {
  async fetch({ commit }, payload = {}) {
    const { params = {} } = payload;

    if (this.$auth.user && this.$auth.user.id) {
      params.member_id = this.$auth.user.id;
    }

    const { token, cartId } = CartCredentialProvider.getCredentials();

    if (token) {
      params.token = token;
    }

    if (cartId) {
      params.cart_id = cartId;
    }

    const response = await this.$api.fetch("carts", { params });

    commit("setCartFromResponse", response);

    CartCredentialProvider.setCredentials(response.id, response.token);
  },

  async store({ dispatch, commit, state }, product) {
    const params = {
      product_number: product.product_number,
      color_id: product.color_id,
      size_id: product.size_id,
      closed_market_id: product.closed_market_id,
      status: product.status,
      count: Number(product.count),
    };

    if (this.$auth.user && this.$auth.user.id) {
      params.member_id = this.$auth.user.id;
    }

    const { token, cartId } = CartCredentialProvider.getCredentials();

    if (token) {
      params.token = token;
    }

    if (cartId) {
      params.cart_id = cartId;
    }

    const response = await this.$api.store(`carts`, params);

    commit("setCartFromResponse", response);

    CartCredentialProvider.setCredentials(response.id, response.token);

    return response;
  },

  async updateItem({ commit, state }, { cartId, cartItemId, params }) {
    const token = CartCredentialProvider.getToken();

    if (token) {
      params.token = token;
    }

    const response = await this.$api.update(
      `carts/${cartId}/items/${cartItemId}`,
      params
    );

    commitUpdateCartResponse(response.data, commit, state);

    return response;
  },

  async restoreItem({ commit, state }, { cartId, cartItemId, params = {} }) {
    const token = CartCredentialProvider.getToken();

    if (token) {
      params.token = token;
    }

    const response = await this.$api.update(
      `carts/${cartId}/restore_items/${cartItemId}`,
      params
    );

    commitUpdateCartResponse(response.data, commit, state);

    return response;
  },

  async removeItem({ commit, state }, { cartId, cartItemId, params = {} }) {
    const token = CartCredentialProvider.getToken();

    if (token) {
      params.token = token;
    }

    const response = await this.$api.destroy(
      `carts/${cartId}/remove_items/${cartItemId}`,
      { params }
    );

    commitUpdateCartResponse(response.data, commit, state, [cartItemId]);

    return response;
  },

  async updatePaymentType({ commit, state }, paymentType) {
    const param = {
      payment_type: paymentType,
      cart_id: state.cart.id,
    };

    if (this.$auth.user && this.$auth.user.id) {
      param.member_id = this.$auth.user.id;
    }

    const token = CartCredentialProvider.getToken();

    if (token) {
      param.token = token;
    }

    const response = await this.$api.store(
      `purchase/change_payment_type`,
      param
    );

    commitUpdateCartResponse(response, commit, state);
  },

  async changeUseCoupons({ commit, state }, { useCouponIds, params = {} }) {
    const response = await this.$api.store(
      `carts/coupon`,
      Object.assign({}, params, {
        cart_id: state.cart.id,
        use_coupon_ids: useCouponIds,
      })
    );

    commitUpdateCartResponse(response, commit, state);
  },

  async updateUsePoint({ commit, state }, { cartId, params }) {
    const { data } = await this.$api.update(
      `carts/${cartId}/use_point`,
      params
    );

    commitUpdateCartResponse(data, commit, state);
  },
};

export const getters = {
  cart: (state, getters, rootState, rootGetters) => {
    return state.cart;
  },
  orderType: (state, getters, rootState, rootGetters) => {
    return state.cart.order_type;
  },
  products: (state, getters, rootState, rootGetters) => {
    return state.cart.products;
  },
  productCount: (state, getters, rootState, rootGetters) => {
    return state.cart.products.reduce((sum, product) => {
      return sum + product.count;
    }, 0);
  },
  orderInfo: (state, getters, rootState, rootGetters) => {
    return state.cart.order;
  },
  productCost: (state, getters, rootState, rootGetters) => {
    return state.cart.order.products_cost;
  },
  campaignReduceCost: (state, getters, rootState, rootGetters) => {
    return state.cart.order.campaign_reduce;
  },
  couponDiscount: (state) => state.coupon_discount,
  transferCost: (state, getters, rootState, rootGetters) => {
    return state.cart.order.transfer_cost;
  },
  totalCost: (state, getters, rootState, rootGetters) => {
    return state.cart.totalCost;
  },
  returnPoints: (state, getters, rootState, rootGetters) => {
    return state.cart.points;
  },
  availableCoupons: (state) => {
    return state.availableCoupons;
  },
  combinableAvailableCoupons: (state, { availableCoupons }) => {
    return availableCoupons.filter((coupon) => Number(coupon.is_combinable));
  },
  uncombinableAvailableCoupons: (state, { availableCoupons }) => {
    return availableCoupons.filter((coupon) => !Number(coupon.is_combinable));
  },
  useCoupons: ({ cart }) => cart.useCoupons,
  useCouponIds: (state, { useCoupons }) => useCoupons.map(({ id }) => id),
  useCouponIdDict(state, { useCouponIds }) {
    return createDict(useCouponIds || []);
  },
  couponDiscountTypeKv: (state, getters, rootState, rootGetters) => {
    return rootGetters["enum/kv"].coupon__discount_type || {};
  },
  cartItemInvalidReasonKv: (state, getters, rootState, rootGetters) => {
    return rootGetters["enum/kv"].cart_item__invalid_reason || {};
  },
  isReserved: (state, getters, rootState, rootGetters) => {
    const orderTypes = rootGetters["master/orderTypes"];
    const reserve = orderTypes.find((orderType) => {
      return orderType.key === ORDER_TYPE.RESERVE;
    });
    return Number(reserve.value) === Number(state.cart.order_type);
  },
  isBackOrdered: (state, getters, rootState, rootGetters) => {
    const orderTypes = rootGetters["master/orderTypes"];
    const backOrder = orderTypes.find((orderType) => {
      return orderType.key === ORDER_TYPE.BACK_ORDER;
    });
    return Number(backOrder.value) === Number(state.cart.order_type);
  },
  hasNoItems: (state, { products }) =>
    products.filter((item) => !item.lapsed).length === 0,
};
