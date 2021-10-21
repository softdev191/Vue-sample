export const state = () => ({
  orders: [],
});

export const mutations = {
  set: (state, response) => {
    state.orders = response;
  },
};
export const actions = {
  async fetch({ state, commit }) {
    const response = await this.$api.fetch(
      `member/${this.$auth.user.id}/purchase`
    );
    commit("set", response);
  },
  async cancel({ state, commit }, orderCode) {
    const response = await this.$api.store(
      `member/${this.$auth.user.id}/order/${orderCode}/cancel`
    );
    commit("set", response);
  },
};

export const getters = {
  orders: (state, getters, rootState, rootGetters) => {
    return state.orders;
  },
};
