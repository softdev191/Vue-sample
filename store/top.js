import {
  ONE_HOUR,
  CACHE_KEY_TOP_FETCH_BY_STORE_BRAND,
} from "@/constants/lruCache";
import Vue from "vue";
import { NEW_ITEMS } from "@/constants";
import { PICKUPS } from "@/constants";

export const state = () => ({
  data: {
    main_visuals: null,
    new_items: null,
    pickups: null,
    features: null,
    stylings: null,
    news: null,
    background_color: "#FFFFFF",
  },
  cache: {},
});

export const mutations = {
  setData: (state, { data }) => {
    state.data = { ...data };
  },
  setCache: (state, { data, params }) => {
    const cacheKey = params
      ? `${CACHE_KEY_TOP_FETCH_BY_STORE_BRAND}_${params.store_brand}`
      : CACHE_KEY_TOP_FETCH_BY_STORE_BRAND;

    if (!state.cache[cacheKey]) {
      state.cache[cacheKey] = {};
    }
    state.cache[cacheKey].data = { ...data };
    state.cache[cacheKey].gotAt = Date.now();
  },
  updateItem(state, { itemType, id, name, value }) {
    let item;
    if (itemType === NEW_ITEMS) {
      item = state.data.new_items.find(
        (item) => Number(item.id) === Number(id)
      );
    } else if (itemType === PICKUPS) {
      item = state.data.pickups.find((item) => Number(item.id) === Number(id));
    }

    if (item) {
      Vue.set(item, name, value);
    }
  },
};

export const actions = {
  async fetchByStoreBrand({ commit, state }, params = { useCache: false }) {
    const cacheKey = params
      ? `${CACHE_KEY_TOP_FETCH_BY_STORE_BRAND}_${params.store_brand}`
      : CACHE_KEY_TOP_FETCH_BY_STORE_BRAND;

    if (process.server && params.useCache) {
      const cachedData = this.$lru.getLongCache(cacheKey);
      if (cachedData) {
        commit("setCache", { data: cachedData, params });
        commit("setData", { data: cachedData });
      } else {
        const { data } = await this.$api.fetch(`tops/store_brand`, { params });
        commit("setCache", { data, params });
        commit("setData", { data });
        this.$lru.setLongCache(cacheKey, data);
      }
    } else {
      const cacheTime =
        state.cache[cacheKey] && state.cache[cacheKey].gotAt
          ? state.cache[cacheKey].gotAt
          : 0;

      if (Date.now() - cacheTime > ONE_HOUR) {
        const { data } = await this.$api.fetch(`tops/store_brand`, { params });
        commit("setCache", { data, params });
        commit("setData", { data });
      } else {
        commit("setData", { data: state.cache[cacheKey].data });
      }
    }
  },
  async updateFavorite({ commit }, { itemType, isFavorite, id }) {
    commit("updateItem", {
      itemType,
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
        itemType,
        id,
        name: "is_favorite",
        value: !isFavorite,
      });
    }
  },
};

export const getters = {
  title: (state, getters, rootState, rootGetters) => {
    return state.title;
  },
  data: (state, getters, rootState, rootGetters) => {
    return state.data;
  },
  main_visuals: (state) => state.data.main_visuals,
  newItems: (state) => state.data.new_items,
  pickups: (state) => state.data.pickups,
  features: (state) => state.data.features,
  stylings: (state) => state.data.stylings,
  news: (state) => state.data.news,
  background_color: (state) => state.data.background_color,
};
