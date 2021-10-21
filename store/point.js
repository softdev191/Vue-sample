export const state = () => ({
  point: {
    amount: 0,
    limit_date: undefined,
    about_limit: "",
    histories: [],
    next_page: 0,
  },
});

export const mutations = {
  setPointFromResponse: (state, response) => {
    state.point = {
      amount: response.amount,
      limit_date: response.limit_date,
      about_limit: response.about_limit,
      histories: response.histories,
      next_page: response.next_page,
    };
  },
};
export const actions = {
  async fetch({ rootState, commit }) {
    const response = await this.$api.fetch(
      `member/${rootState.auth.user.id}/point`
    );
    commit("setPointFromResponse", response);
  },
};

export const getters = {
  amount: (state, getters, rootState, rootGetters) => {
    return state.point.amount;
  },
  limitDate: (state, getters, rootState, rootGetters) => {
    return state.point.limit_date;
  },
  aboutLimit: (state, getters, rootState, rootGetters) => {
    return state.point.about_limit;
  },
  histories: (state, getters, rootState, rootGetters) => {
    return state.point.histories;
  },
};
