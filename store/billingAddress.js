import querystring from "querystring";

export const state = () => ({
  data: [],
});

export const mutations = {
  setData: (state, data) => {
    state.data = data;
  },

  update: (state, data) => {
    const targetIndex = state.data.findIndex(
      ({ id }) => Number(id) === Number(data.id)
    );

    if (targetIndex === -1) {
      return;
    }

    state.data.splice(targetIndex, 1, data);
  },

  delete: (state, targetId) => {
    const targetIndex = state.data.findIndex(
      ({ id }) => Number(id) === Number(targetId)
    );

    if (targetIndex === -1) {
      return;
    }

    state.data.splice(targetIndex, 1);
  },
};

export const actions = {
  async fetch({ rootState, commit }) {
    const query = querystring.stringify({ billing_address_flag: 1 });

    const response = await this.$api.fetch(
      `member/${rootState.auth.user.id}/destinations/?${query}`
    );

    commit("setData", response);
  },

  async create({ rootState, commit }, payload) {
    const data = { ...payload };

    const response = await this.$api.store(
      `member/${rootState.auth.user.id}/destinations`,
      Object.assign({}, data, {
        billing_address_flag: 1,
        zip: (data.zip || "").replace(/-/g, ""),
      })
    );

    commit("setData", [response]);
  },

  async update({ rootState, commit }, payload) {
    const response = await this.$api.update(
      `member/${rootState.auth.user.id}/destinations/${payload.id}`,
      Object.assign({}, payload, {
        billing_address_flag: 1,
        zip: (payload.zip || "").replace(/-/g, ""),
      })
    );

    commit("update", response.data);
  },

  updateOrCreate({ getters, dispatch }, { params }) {
    if (!getters.isStored) {
      return dispatch("create", params);
    }

    return dispatch("update", { ...params, id: getters.findOne.id });
  },

  async delete({ rootState, commit }, id) {
    await this.$api.destroy(
      `member/${rootState.auth.user.id}/destinations/${id}`
    );

    commit("delete", Number(id));
  },
};

export const getters = {
  findOne: ({ data }, getters, rootState) => data[0] || rootState.auth.user,
  isStored: ({ data }) => data.length > 0,
};
