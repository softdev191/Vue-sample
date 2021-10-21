export const state = () => ({
  pending: false,
  loading: false,
});

export const getters = {
  pending(state) {
    return state.pending;
  },
  loading(state) {
    return state.loading;
  },
  onlyPending(state) {
    return state.pending && !state.loading;
  },
};

export const mutations = {
  pending(state, value) {
    state.pending = value;
  },
  loading(state, value) {
    state.pending = value;
    state.loading = value;
  },
};
