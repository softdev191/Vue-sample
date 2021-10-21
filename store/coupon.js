export const state = () => ({
  valid_coupons: [],
  my_coupons: [],
  issue_coupon: {},
});

export const mutations = {
  setValidCoupons: (state, param) => {
    state.valid_coupons = param || [];
  },
  setMyCoupons: (state, param) => {
    state.my_coupons = param || [];
  },
  setIssueCoupon: (state, param) => {
    state.issue_coupon = param || {};
  },
};
export const actions = {
  async fetch({ rootState, commit }) {
    const response = await this.$api.fetch(
      `member/${rootState.auth.user.id}/coupon`
    );
    commit("setValidCoupons", response.valid_coupons);
    commit("setMyCoupons", response.my_coupons);
  },
  setIssueCoupon({ rootState, commit }, coupon) {
    commit("setIssueCoupon", coupon);
  },
  async issue({ rootState, commit }, couponId) {
    const response = await this.$api.store(
      `member/${rootState.auth.user.id}/coupon/${couponId}`
    );
    commit("setValidCoupons", response.valid_coupons);
    commit("setMyCoupons", response.my_coupons);
  },
};

export const getters = {
  validCoupons: (state) => {
    return state.valid_coupons;
  },
  myCoupons: (state) => {
    return state.my_coupons;
  },
  issueCoupon: (state) => {
    return state.issue_coupon;
  },
};
