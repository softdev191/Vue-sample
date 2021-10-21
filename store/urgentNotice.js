export const state = () => ({
  data: [],
});

export const mutations = {
  set(state, data) {
    state.data = { ...data };
  },
};

export const actions = {
  async fetch({ commit }, { useCache = false } = {}) {
    if (process.server && useCache) {
      const cachedData = this.$lru.getMediumCache("urgent-notice");

      if (cachedData) {
        return commit("set", cachedData);
      }
    }

    const { data } = await this.$api.fetch("urgent_notice");

    if (process.server) {
      this.$lru.setMediumCache("urgent-notice", data);
    }

    commit("set", data);
  },
};

export const getters = {
  data: ({ data }) => data,
};
