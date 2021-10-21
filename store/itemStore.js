import Vue from "vue";

export const state = () => ({
  data: [],
  cursor: {
    currentPage: 0,
    isReachedEnd: false,
  },
});

export const mutations = {
  set(state, data) {
    state.data = data;
  },

  append(state, data) {
    state.data.push(...data);
  },

  setCurrentPage(state, page) {
    Vue.set(state.cursor, "currentPage", page);
  },

  setReachedEnd(state, isReachedEnd) {
    Vue.set(state.cursor, "isReachedEnd", isReachedEnd);
  },

  clear(currentState) {
    const { data, cursor } = state();
    currentState.data = data;
    currentState.cursor = cursor;
  },
};

export const actions = {
  async fetchCursor({ commit }, { itemId, params = {} } = {}) {
    const response = await this.$api.fetch(`items/${itemId}/stores`, {
      params,
    });

    const { data, meta } = response;
    const page = 1;

    const isReachedEnd = page >= meta.last_page;

    commit("set", data);
    commit("setCurrentPage", page);
    commit("setReachedEnd", isReachedEnd);
  },

  async nextPage({ commit, state }, { itemId, params = {} } = {}) {
    const { cursor } = state;

    if (cursor.isReachedEnd) {
      return;
    }

    const page = cursor.currentPage + 1;

    const response = await this.$api.fetch(`items/${itemId}/stores`, {
      params: { ...params, page },
    });

    const { data, meta } = response;

    commit("append", data);
    commit("setCurrentPage", page);
    commit("setReachedEnd", page >= meta.last_page);
  },
};

export const getters = {
  data: ({ data }) => data,
  cursor: ({ cursor }) => cursor,
};
