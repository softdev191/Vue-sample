export const state = () => ({
  cardId: "",
  pinCode: "",
  email: "",
  emailConfirm: "",
});

export const mutations = {
  setCardId: (state, param) => {
    state.cardId = param;
  },
  setPinCode: (state, param) => {
    state.pinCode = param;
  },
  setEmail: (state, param) => {
    state.email = param;
  },
  setEmailConfirm: (state, param) => {
    state.emailConfirm = param;
  },
};
export const actions = {
  setCardId: ({ dispatch, commit }, param) => {
    commit("setCardId", param);
  },
  setPinCode: ({ dispatch, commit }, param) => {
    commit("setPinCode", param);
  },
  setEmail: ({ dispatch, commit }, param) => {
    commit("setEmail", param);
  },
  setEmailConfirm: ({ dispatch, commit }, param) => {
    commit("setEmailConfirm", param);
  },
};

export const getters = {
  cardId: (state, getters, rootState, rootGetters) => {
    return state.cardId;
  },
  pinCode: (state, getters, rootState, rootGetters) => {
    return state.pinCode;
  },
  email: (state, getters, rootState, rootGetters) => {
    return state.email;
  },
  emailConfirm: (state, getters, rootState, rootGetters) => {
    return state.emailConfirm;
  },
};
