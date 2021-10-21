import storageProvider from "@/storage/provider/redisplayRequestToken";

export const state = () => ({
  data: [],
});

export const mutations = {
  set(state, { data }) {
    state.data = data;
  },

  addOne(state, data) {
    const index = state.data.findIndex(
      (request) =>
        Number(request.item_detail_id) === Number(data.item_detail_id)
    );

    if (index >= 0) {
      state.data.splice(index, 0, 1, data);
    } else {
      state.data = [...state.data, data];
    }
  },

  delete(state, itemDetailId) {
    const index = state.data.findIndex(
      (request) => Number(request.item_detail_id) === Number(itemDetailId)
    );

    if (index < 0) {
      return;
    }

    state.data.splice(index, 1);
  },
};

export const actions = {
  async fetch({ commit, getters }, { productNumber }) {
    const params = {
      user_token: getters.token,
    };

    const response = await this.$api.fetch(
      `items/${productNumber}/redisplay_requests`,
      { params }
    );

    const { data } = response;

    commit("set", { data });
  },

  async create({ commit, getters }, { params }) {
    params.user_token = getters.token;

    const response = await this.$api.store(
      "item_detail_redisplay_requests",
      params
    );

    commit("addOne", response.data);
  },

  async delete({ commit, getters }, { itemDetailId }) {
    const userToken = getters.token;

    await this.$api.destroy(
      `item_detail/${itemDetailId}/redisplay_requests?user_token=${userToken}`
    );

    commit("delete", itemDetailId);
  },
};

export const getters = {
  data: ({ data }) => data,
  dict: ({ data }) => {
    return data.reduce((dict, request) => {
      return Object.assign(dict, { [request.item_detail_id]: request });
    }, {});
  },
  token: () => storageProvider.getToken(),
};
