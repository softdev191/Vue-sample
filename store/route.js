export const state = () => ({
  redirectPath: null,
});

export const mutations = {
  setRedirectPath: (state, redirectPath) => {
    state.redirectPath = redirectPath;
  },
};
export const actions = {};

export const getters = {
  redirectPath: (state, getters, rootState, rootGetters) => {
    return state.redirectPath;
  },
};
