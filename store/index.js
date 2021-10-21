import Vue from "vue";

export const state = () => ({
  sessionData: {},
});

export const mutations = {
  countUp(state) {
    state.counter++;
  },
  setSessionData: (state, data) => {
    Object.keys(data).forEach((key) => {
      Vue.set(state.sessionData, key, data[key]);
    });
  },
  clearSessionData: (state, key = null) => {
    if (key !== null) {
      Vue.delete(state.sessionData, key);
    } else {
      state.sessionData = {};
    }
  },
};
export const actions = {
  async fetchUser() {
    await this.$auth.fetchUser();
  },

  async updateUser(context, { params }) {
    const { data } = await this.$api.update(
      `member/${this.$auth.user.id}`,
      params
    );

    this.$auth.setUser(data);
  },
};

export const getters = {
  user: (state, getters, rootState) => {
    return rootState.auth.user;
  },
  sessionData: ({ sessionData }) => sessionData,
};
