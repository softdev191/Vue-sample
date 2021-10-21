import Vue from "vue";

export const state = () => ({
  currentId: undefined,
  destinations: [],
});

export const mutations = {
  setFromResponse: (state, response) => {
    state.destinations = response;
  },
  add: (state, param) => {
    state.destinations.push(param);
  },
  update: (state, param) => {
    const index = state.destinations.findIndex((el) => el.id === param.id);
    if (index > -1) {
      Vue.set(state.destinations, index, param);
    }
  },
  delete: (state, id) => {
    const index = state.destinations.findIndex((el) => el.id === id);
    if (index > -1) {
      state.destinations.splice(index, 1);
    }
  },
};
export const actions = {
  async fetch({ rootState, commit }) {
    const response = await this.$api.fetch(
      `member/${rootState.auth.user.id}/destinations`
    );
    commit("setFromResponse", response);
  },
  async create({ rootState, commit }, payload) {
    const data = { ...payload };
    data.zip = data.zip.replace(/-/g, "");
    const response = await this.$api.store(
      `member/${rootState.auth.user.id}/destinations`,
      data
    );
    commit("add", response);
  },
  async update({ rootState, commit }, payload) {
    const response = await this.$api.update(
      `member/${rootState.auth.user.id}/destinations/${payload.id}`,
      payload
    );
    commit("update", response.data);
  },
  async delete({ rootState, commit }, id) {
    await this.$api.destroy(
      `member/${rootState.auth.user.id}/destinations/${id}`
    );
    commit("delete", parseInt(id));
  },
};

export const getters = {
  destinations: (state, getters, rootState, rootGetters) => {
    return state.destinations;
  },
};
