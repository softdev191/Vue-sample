export const state = () => ({
  card: {
    id: undefined,
    pin: undefined,
  },
  email: undefined,
  emailConfirmation: undefined,
});

export const mutations = {
  setCard: (state, param) => {
    state.card = param;
  },
  setCardId: (state, param) => {
    state.card.id = param;
  },
  setPinCode: (state, param) => {
    state.card.pin = param;
  },
  setEmail: (state, param) => {
    state.email = param;
  },
  setEmailConfirmation: (state, param) => {
    state.emailConfirmation = param;
  },
};
export const actions = {
  setCard: ({ dispatch, commit }, param) => {
    commit("setCard", param);
  },
  setCardId: ({ dispatch, commit }, param) => {
    commit("setCardId", param);
  },
  setPinCode: ({ dispatch, commit }, param) => {
    commit("setPinCode", param);
  },
  setEmail: ({ dispatch, commit }, param) => {
    commit("setEmail", param);
  },
  setEmailConfirmation: ({ dispatch, commit }, param) => {
    commit("setEmailConfirmation", param);
  },
};

export const getters = {
  card: (state, getters, rootState, rootGetters) => {
    return state.card;
  },
  email: (state, getters, rootState, rootGetters) => {
    return state.email;
  },
  emailConfirmation: (state, getters, rootState, rootGetters) => {
    return state.emailConfirmation;
  },
};
