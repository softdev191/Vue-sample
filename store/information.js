export const state = () => ({
  data: [],
  detail: {},
});

export const mutations = {
  set(state, data) {
    state.data = [...data];
  },

  setDetail(state, data) {
    state.detail = { ...data };
  },
};

export const actions = {
  async get({ commit }, { id }) {
    const { data } = await this.$api.fetch(`information/${id}`);

    commit("setDetail", data);
  },

  async fetchTop({ commit, state }) {
    if (state.data.length === 0) {
      const { data } = await this.$api.fetch("information/top_content");
      commit("set", data);
    }
  },

  async fetchRecent({ commit }, params = {}) {
    const { data } = await this.$api.fetch("information/recent", { params });

    commit("set", data);
  },

  async adminPreview({ commit }, { key, token }) {
    const { data } = await this.$adminApi.fetch(
      `information_preview/${key}`,
      token
    );
    commit("setDetail", data);
  },
};

export const getters = {
  data: ({ data }) => data,
  detail: ({ detail }) => detail,
  find: ({ data }) => (searchId) =>
    data.find(({ id }) => Number(id) === Number(searchId)),
};
