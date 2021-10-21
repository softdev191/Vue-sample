export const state = () => ({
  data: {},
});

export const mutations = {
  set(state, data) {
    state.data = { ...data };
  },
};

export const actions = {
  set({ commit }, data) {
    commit("set", data);
  },
};

export const getters = {
  data: ({ data }) => data,
};
