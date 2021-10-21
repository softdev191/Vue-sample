export const state = () => ({
  data: null,
});

export const mutations = {
  setData: (state, data) => {
    state.data = data;
  },
};

export const actions = {
  async fetch({ commit }) {
    const response = await this.$api.fetch("purchase/member_credit_cards");

    commit("setData", !response ? null : response.data);
  },

  async delete({ commit }, { id }) {
    await this.$api.destroy(`purchase/member_credit_cards/${id}`);

    commit("setData", null);
  },
};

export const getters = {
  data: ({ data }) => data,
};
