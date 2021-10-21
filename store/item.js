import Vue from "vue";

export const state = () => ({
  isTwoColumn: true,
  data: [],
  recommends: [],
  usedSameStylings: [],
  detail: null,
  pagination: {},
});

export const mutations = {
  set(state, data) {
    state.data = [...state.data, ...data];
  },

  setDetail(state, data) {
    state.detail = { ...data };
  },

  setRecommends(state, data) {
    state.recommends = data;
  },

  setUsedSameStylings(state, data) {
    state.usedSameStylings = data;
  },

  clear(state) {
    state.data = [];
    state.pagination = {};
  },

  updateItem(state, { id, name, value }) {
    ["data", "recommends", "usedSameStylings"].forEach((key) => {
      if (!Array.isArray(state[key])) {
        return;
      }

      const item = state[key].find((item) => Number(item.id) === Number(id));

      if (item) {
        Vue.set(item, name, value);
      }
    });

    if (state.detail && Number(state.detail.id) === Number(id)) {
      Vue.set(state.detail, name, value);
    }
  },

  setPagination(state, params) {
    state.pagination = { ...params };
  },

  toggleDisplay: (state, param) => {
    state.isTwoColumn = !state.isTwoColumn;
  },
};

const formatItemDetail = (data) => {
  const itemImages = data.item_images;

  data.item_details.forEach((itemDetail) => {
    const image = itemImages.find(
      (image) => Number(image.color_id) === Number(itemDetail.color_id)
    );
    itemDetail.item_image = image || {};
  });

  return data;
};

export const actions = {
  toggleDisplay: ({ dispatch, commit }) => {
    commit("toggleDisplay");
  },

  async fetch({ commit, state }, params = {}) {
    params.page =
      state.pagination && state.pagination.current_page !== undefined
        ? state.pagination.current_page + 1
        : 1;
    const { data, meta } = await this.$api.fetch("items", { params });

    commit("set", data);
    commit("setPagination", meta);
  },

  async get({ commit }, { productNumber, useCache = false }) {
    let item;
    if (process.server && useCache) {
      const cachedData = this.$lru.getMediumCache(`item-${productNumber}`);
      if (cachedData) {
        item = cachedData;
      } else {
        const { data } = await this.$api.fetch(`items/${productNumber}`);
        this.$lru.setMediumCache(`item-${productNumber}`, data);
        item = data;
      }
    } else {
      const { data } = await this.$api.fetch(`items/${productNumber}`);
      item = data;
    }

    commit("setDetail", formatItemDetail(item));
  },

  async getClosedMarket({ commit }, { productNumber, id }) {
    const { data } = await this.$api.fetch(
      `items/${productNumber}/closed_markets/${id}`
    );

    commit("setDetail", formatItemDetail(data));
  },

  async fetchRecommends({ commit }, { productNumber, useCache = false }) {
    let recommends;
    if (process.server && useCache) {
      const cachedData = this.$lru.getMediumCache(`itemrecom-${productNumber}`);
      if (cachedData) {
        recommends = cachedData;
      } else {
        const { data } = await this.$api.fetch(
          `items/${productNumber}/recommends`
        );
        this.$lru.setMediumCache(`itemrecom-${productNumber}`, data);
        recommends = data;
      }
    } else {
      const { data } = await this.$api.fetch(
        `items/${productNumber}/recommends`
      );
      recommends = data;
    }

    commit("setRecommends", recommends);
  },

  async fetchUsedSameStylings({ commit }, { productNumber }) {
    const { data } = await this.$api.fetch(
      `items/${productNumber}/used_same_stylings`
    );
    commit("setUsedSameStylings", data);
  },

  async updateFavorite({ commit }, { isFavorite, id }) {
    commit("updateItem", {
      id,
      name: "is_favorite",
      value: isFavorite,
    });

    try {
      const response = await (isFavorite
        ? this.$api.store(`favorites/${id}`)
        : this.$api.destroy(`favorites/${id}`));

      if (!response || response.status >= 400) {
        throw new Error("お気に入りの更新に失敗しました。 item_id: " + id);
      }
    } catch (error) {
      console.error(error);

      commit("updateItem", {
        id,
        name: "is_favorite",
        value: !isFavorite,
      });
    }
  },

  async adminPreview({ commit }, { key, token }) {
    const { data } = await this.$adminApi.fetch(`item_preview/${key}`, token);

    commit("setRecommends", data.recommend_items);
    commit("setUsedSameStylings", data.items_used_same_stylings);
    commit("setDetail", formatItemDetail(data));
  },
};

export const getters = {
  isTwoColumn: (state, getters, rootState, rootGetters) => {
    return state.isTwoColumn;
  },
  list: (state, getters, rootState, rootGetters) => {
    return rootGetters["api/list"];
  },
  data: ({ data }) => data,
  detail: ({ detail }) => detail,
  recommends: ({ recommends }) => recommends,
  usedSameStylings: ({ usedSameStylings }) => usedSameStylings,
  pagination: ({ pagination }) => pagination,
  isReachLastPage: ({ pagination }) =>
    pagination.current_page >= pagination.last_page,
};
