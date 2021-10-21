export const state = () => ({
  list: [],
});

export const mutations = {
  setList(state, param) {
    state.list = param;
  },
};

export const actions = {
  search: ({ commit }, text) => {
    commit("setList", [{ name: "aaa" }]);
  },
};

export const getters = {
  list: (state) => {
    return state.list;
  },
};
