export const state = () => ({
  title: undefined,
  detail: undefined,
});

export const mutations = {
  setTitle(state, payload) {
    state.title = payload;
  },
  setDetail(state, payload) {
    state.detail = payload;
  },
};
export const actions = {
  setError({ dispatch, commit }, param) {
    commit("setTitle", param.title);
    commit("setDetail", param.detail);
  },
  clear({ dispatch, commit }, param) {
    commit("setTitle", undefined);
    commit("setDetail", undefined);
  },
};

export const getters = {
  error: (state, getters, rootState, rootGetters) => {
    if (state.title === undefined && state.detail === undefined) {
      return undefined;
    }
    return {
      title: state.title,
      detail: state.detail,
    };
  },
};
