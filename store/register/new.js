export const state = () => ({
  email: undefined,
  emailConfirmation: undefined,
});

export const mutations = {
  setEmail: (state, param) => {
    state.email = param;
  },
  setEmailConfirmation: (state, param) => {
    state.emailConfirmation = param;
  },
};
export const actions = {
  setEmail: ({ dispatch, commit }, param) => {
    commit("setEmail", param);
  },
  setEmailConfirmation: ({ dispatch, commit }, param) => {
    commit("setEmailConfirmation", param);
  },
};

export const getters = {
  email: (state, getters, rootState, rootGetters) => {
    return state.email;
  },
  emailConfirmation: (state, getters, rootState, rootGetters) => {
    return state.emailConfirmation;
  },
};
