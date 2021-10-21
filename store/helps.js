export const state = () => ({
  data: [],
  detail: {},
  related: [],
  pagination: {},
});

export const mutations = {
  set(state, data) {
    state.data = [...data];
  },

  setDetail(state, data) {
    state.detail = { ...data };
  },

  setRelated(state, data) {
    state.related = { ...data };
  },

  setPagination(state, params) {
    state.pagination = { ...params };
  },
};
export const actions = {
  async fetch({ commit, state }, params = {}) {
    const { data, meta } = await this.$api.fetch("contents/helps", { params });

    commit("set", data);
    commit("setPagination", meta);
  },

  async get({ commit }, { id }) {
    const { help, related } = await this.$api.fetch(`contents/helps/${id}`);

    commit("setDetail", help);
    commit("setRelated", related);
  },
};

export const getters = {
  data: ({ data }) => data,
  detail: ({ detail }) => detail,
  related: ({ related }) => related,
  pagination: ({ pagination }) => pagination,
};
