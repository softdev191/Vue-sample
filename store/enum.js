import { arr2Kv } from "@/utils/object";

export const getters = {
  kv: (state, getters, rootState, rootGetters) => {
    const enums = rootGetters["master/enums"];

    return Object.keys(enums).reduce(
      (data, key) => ({
        ...data,
        [key]: arr2Kv(enums[key]),
      }),
      {}
    );
  },

  vk: (state, getters, rootState, rootGetters) => {
    const enums = rootGetters["master/enums"];

    return Object.keys(enums).reduce(
      (data, key) => ({
        ...data,
        [key]: enums[key].reduce(
          (kv, { value, key }) => ({
            ...kv,
            [value]: key,
          }),
          {}
        ),
      }),
      {}
    );
  },

  keyLabel: (state, getters, rootState, rootGetters) => {
    const enums = rootGetters["master/enums"];

    return Object.keys(enums).reduce(
      (data, key) => ({
        ...data,
        [key]: arr2Kv(enums[key], {
          valueName: "label",
        }),
      }),
      {}
    );
  },

  valueLabel: (state, getters, rootState, rootGetters) => {
    const enums = rootGetters["master/enums"];

    return Object.keys(enums).reduce(
      (data, key) => ({
        ...data,
        [key]: enums[key].reduce(
          (kv, { value, label }) => ({
            ...kv,
            [value]: label,
          }),
          {}
        ),
      }),
      {}
    );
  },

  options: (state, getters, rootState, rootGetters) => {
    const enums = rootGetters["master/enums"];

    return Object.keys(enums).reduce(
      (data, key) => ({
        ...data,
        [key]: enums[key].map(({ value, label }) => ({
          id: value,
          name: label,
        })),
      }),
      {}
    );
  },

  errorCodeKv: (state, { kv }, rootState, rootGetters) =>
    kv.common__error_code || {},
};
