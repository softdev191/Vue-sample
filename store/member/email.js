export const state = () => ({
  email: "",
  emailConfirm: "",
});

export const mutations = {
  setEmail: (state, param) => {
    state.email = param;
  },
  setEmailConfirm: (state, param) => {
    state.emailConfirm = param;
  },
};
export const actions = {
  setEmail: ({ dispatch, commit }, param) => {
    commit("setEmail", param);
  },
  setEmailConfirm: ({ dispatch, commit }, param) => {
    commit("setEmailConfirm", param);
  },
};

export const getters = {
  email: (state, getters, rootState, rootGetters) => {
    return state.email;
  },
  emailConfirm: (state, getters, rootState, rootGetters) => {
    return state.emailConfirm;
  },
};
