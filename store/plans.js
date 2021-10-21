export const state = () => ({
  data: [],
  detail: {},
  pagination: {},
});

export const mutations = {
  set(state, data) {
    state.data = [...state.data, ...data];
  },

  setDetail(state, data) {
    state.detail = { ...data };
  },

  setPagination(state, params) {
    state.pagination = { ...params };
  },

  clear(state) {
    state.data = [];
    state.pagination = {};
  },
};

export const actions = {
  async fetch({ commit, state }, params = {}) {
    params.page =
      state.pagination && state.pagination.current_page !== undefined
        ? state.pagination.current_page + 1
        : 1;
    const { data, meta } = await this.$api.fetch("contents/plans", { params });

    if (meta.current_page === 1) {
      commit("clear");
    }

    commit("set", data);
    commit("setPagination", meta);
  },

  async get({ commit }, { slug }) {
    const { data } = await this.$api.fetch(`contents/plans/${slug}`);

    commit("setDetail", data);
  },

  clear({ commit }) {
    commit("clear");
  },
};

export const getters = {
  data: ({ data }) => data,
  detail: ({ detail }) => detail,
  pagination: ({ pagination }) => pagination,
  isReachLastPage: ({ pagination }) =>
    pagination.current_page >= pagination.last_page,
};
