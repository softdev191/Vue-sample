export const state = () => ({
  page: {},
});

export const mutations = {
  setPage(state, data) {
    state.page = { ...data };
  },
};
export const actions = {
  async get({ commit }, { slug }) {
    const { data } = await this.$api.fetch(`pages/${slug}`);
    commit("setPage", data);
  },
};

export const getters = {
  page: ({ page }) => page,
};
