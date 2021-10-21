export const state = () => ({
  data: [],
  pagination: {},
});

export const mutations = {
  set(state, data) {
    state.data = [...data];
  },

  setOne(state, data) {
    if (state.data.length === 0) {
      state.data.push(data);
      return;
    }

    const index = state.data.findIndex(
      (item) => Number(item.id) === Number(data.id)
    );

    if (index === -1) {
      state.data.push(data);
      return;
    }

    state.data.splice(index, 1, data);
  },

  setPagination(state, params) {
    state.pagination = { ...params };
  },
};

export const actions = {
  async fetch({ commit, state }, params = {}) {
    const { data, meta } = await this.$api.fetch("information", { params });

    commit("set", data);
    commit("setPagination", meta);
  },

  async get({ commit }, { id }) {
    const { data } = await this.$api.fetch(`information/${id}`);

    commit("setOne", data);
  },
};

export const getters = {
  data: ({ data }) => data,
  find: ({ data }) => (searchId) =>
    data.find(({ id }) => Number(id) === Number(searchId)),
  pagination: ({ pagination }) => pagination,
};
