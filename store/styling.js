import Vue from "vue";

export const state = () => ({
  data: [],
  cursor: {
    currentPage: 0,
    isReachedEnd: false,
  },
});

export const getters = {
  data: ({ data }) => data,
  cursor: ({ cursor }) => cursor,
};

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
};

export const actions = {
  async fetchCursor({ commit }, { params = {} } = {}) {
    const { data, meta } = await this.$api.fetch("contents/stylings", {
      params,
    });
    const page = 1;

    const isReachedEnd = page >= meta.last_page;

    commit("set", data);
    commit("setCurrentPage", page);
    commit("setReachedEnd", isReachedEnd);
  },

  async nextPage({ commit, state }, { params = {} } = {}) {
    const { cursor } = state;

    if (cursor.isReachedEnd) {
      return;
    }

    const page = cursor.currentPage + 1;

    const { data, meta } = await this.$api.fetch("contents/stylings", {
      params: { ...params, page },
    });

    commit("append", data);
    commit("setCurrentPage", page);
    commit("setReachedEnd", page >= meta.last_page);
  },
};
