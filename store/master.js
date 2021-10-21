import { createTree } from "@/utils/object";

export const state = () => ({
  enum: {
    brand__category: [],
    brand__section: [],
    cart__status: [],
    common__status: [],
    common__system: [],
    common__store_brand: [],
    common__error_code: [],
    contact__type: [],
    coupon__target_member_type: [],
    event__discount_type: [],
    event__sale_type: [],
    event__target: [],
    event__target_user_type: [],
    item__fashion_speed: [],
    item__filter: [],
    item__sort: [],
    item__reserve_status: [],
    item__sales_status: [],
    item_image__type: [],
    item_image__size: [],
    mail_dm__type: [],
    member__gender: [],
    order__payment_type: [],
    order__payment_method: [],
    order__delivery_type: [],
    order__delivery_time: [],
    order__has_time: [],
    order__request: [],
    order__status: [],
    order__order_type: [],
    order__has_message: [],
    plan__place: [],
    post_dm__type: [],
    store__stock: [],
    top_content__styling_sort: [],
    withdraw__reason: [],
  },
  brands: [],
  prefs: [],
  colors: [],
  online_categories: [],
  online_tags: [],
  sales_type: [],
  constants: {
    f_regi: {
      shop_id: "",
      api_key: "",
    },
    order: {
      delivery_date: {
        to: 0,
        from: 0,
      },
    },
  },
  instagram_account: [
    { key: "1", value: "" },
    { key: "2", value: "lasud_staff" },
    { key: "3", value: "vin__jp" },
    { key: "4", value: "aga_japan" },
    { key: "5", value: "fennel_jp" },
    { key: "6", value: "radiatejapan" },
    { key: "7", value: "clove_japan" },
  ],
});

export const mutations = {
  setMaster: (state, param) => {
    state.enum = param.enum || {};
    state.brands = param.brands || [];
    state.prefs = param.prefs || [];
    state.colors = param.colors || [];
    state.online_categories = param.online_categories || [];
    state.online_tags = param.online_tags || [];
    state.sales_type = param.sales_type || [];
    state.constants = param.constants || {};
  },
};
export const actions = {
  async fetch({ commit }, { useCache = false } = {}) {
    if (process.server && useCache) {
      const cachedData = this.$lru.getMediumCache("master");

      if (cachedData) {
        return commit("setMaster", cachedData);
      }
    }

    const response = await this.$api.fetch("master");

    if (process.server) {
      this.$lru.setMediumCache("master", response);
    }

    commit("setMaster", response);
  },
  async fetchNew({ commit }) {
    const response = await this.$api.fetch("master");
    commit("setMaster", response);
  },
};

const traceAncestors = (node, dict) => {
  const ancestors = [];

  while (node.parent_id) {
    node = dict[node.parent_id];
    ancestors.push(node);
  }

  return ancestors.reverse();
};

export const getters = {
  enums: (state) => {
    return state.enum;
  },
  cartStatuses: (state) => {
    return state.enum.cart__status;
  },
  orderTypes: (state) => {
    return state.enum.order__order_type;
  },
  contactTypes: (state) => {
    return state.enum.contact__type;
  },
  commonStoreBrands: (state) => {
    return state.enum.common__store_brand;
  },
  orderDeliveryTypes: (state) => {
    return state.enum.order__delivery_type;
  },
  orderHasTimes: (state) => {
    return state.enum.order__has_time;
  },
  orderDeliveryTime: (state) => {
    return state.enum.order__delivery_time;
  },
  orderDeliveryTimeStrings: (state) => {
    const values = state.enum.order__delivery_time.map((deliveryTime) => {
      return deliveryTime.value;
    });
    return values.join(",");
  },
  orderHasMessages: (state) => {
    return state.enum.order__has_message;
  },
  orderPaymentTypes: (state) => {
    return state.enum.order__payment_type;
  },
  orderPaymentMethod: (state) => {
    return state.enum.order__payment_method;
  },
  orderPaymentMethodStrings: (state) => {
    const values = state.enum.order__payment_method.map((cardPaymentMethod) => {
      return cardPaymentMethod.value;
    });
    return values.join(",");
  },
  orderRequest: (state) => {
    return state.enum.order__request;
  },
  orderRequestStrings: (state) => {
    const values = state.enum.order__request.map((orderRequest) => {
      return orderRequest.value;
    });
    return values.join(",");
  },
  genders: (state) => {
    return state.enum.member__gender;
  },
  brands(state) {
    return state.brands;
  },
  prefs(state) {
    return state.prefs;
  },
  prefIdStrings(state) {
    const prefIds = state.prefs.map((pref) => {
      return pref.id;
    });
    return prefIds.join(",");
  },
  prefNameById: (state) => (prefId) => {
    if (!prefId) {
      return "";
    }
    const targetPref = state.prefs.find((pref) => {
      return pref.id === Number(prefId);
    });
    if (targetPref) {
      return targetPref.name;
    }
    return "";
  },
  mailDmTypes: (state) => {
    return state.enum.mail_dm__type;
  },
  postDmTypes: (state) => {
    return state.enum.post_dm__type;
  },
  withdrawReasons: (state) => {
    return state.enum.withdraw__reason;
  },
  onlineCategories: (state) => {
    return state.online_categories;
  },
  colors: (state) => {
    return state.colors;
  },
  salesTypes: (state) => {
    return state.sales_type;
  },
  onlineCategoryDict: (state) => {
    const dict = state.online_categories.reduce((dict, category) => {
      return Object.assign(dict, { [category.id]: category });
    }, {});
    return dict;
  },
  onlineCategoryTree: (state, { onlineCategoryDict }) => {
    const categories = [...state.online_categories]
      .map((category) => ({ ...category }))
      .sort((c1, c2) => c1.sort - c2.sort);

    return createTree(categories);
  },
  onlineCategoryLeafs: (state) => {
    const categories = [...state.online_categories].map((category) => ({
      ...category,
    }));

    const cache = {};

    return categories
      .sort((c1, c2) => c1.sort - c2.sort)
      .sort((c1, c2) => c1.level - c2.level)
      .reduce((leafs, category) => {
        cache[category.id] = category;

        if (category.is_leaf) {
          const ancestors = traceAncestors(category, cache);
          category.ancestors = ancestors;
          category.ancestorDict = ancestors.reduce((dict, ancestor) => {
            return Object.assign(dict, { [ancestor.id]: ancestor });
          }, {});
          category.ancestorToken = ancestors.map(({ id }) => id).join(":");
          leafs.push(category);
        }

        return leafs;
      }, []);
  },
  categoryGroupTokens: (state, { onlineCategoryLeafs }) => {
    const leafs = onlineCategoryLeafs;
    const cache = {};

    return leafs.reduce((list, { ancestorToken }) => {
      if (!cache[ancestorToken]) {
        cache[ancestorToken] = true;
        list.push(ancestorToken);
      }
      return list;
    }, []);
  },
  categoryOptionGroup: (state, { onlineCategoryLeafs }) => {
    const leafs = onlineCategoryLeafs;

    const groups = leafs.reduce((groups, leaf) => {
      const token = leaf.ancestorToken;
      if (!groups[token]) {
        const name =
          leaf.ancestors.map(({ name }) => name).join(" > ") + "すべて";
        groups[token] = {
          name,
          id: token,
          options: [],
        };
      }

      groups[token].options.push({
        name: leaf.name,
        id: leaf.id,
      });

      return groups;
    }, {});

    return groups;
  },
  brandGroups: (state, getters) => {
    const sections = getters.enums.brand__section;
    const originSection = sections.find(({ key }) => key === "Origin");
    const otherSection = sections.find(({ key }) => key === "Other");
    const cleanBrands = [...state.brands].sort((b1, b2) => b1.sort - b2.sort);

    const origin = cleanBrands.reduce((groups, brand) => {
      if (Number(brand.section) !== Number(originSection.value)) {
        return groups;
      }

      if (!groups[brand.category]) {
        groups[brand.category] = [];
      }

      groups[brand.category].push(brand);

      return groups;
    }, {});

    const other = cleanBrands.reduce((groups, brand) => {
      if (Number(brand.section) !== Number(otherSection.value)) {
        return groups;
      }

      const initial = brand.name.match(/^[a-zA-Z]/)
        ? brand.name.substr(0, 1).toUpperCase()
        : brand.kana.substr(0, 1);

      if (!groups[initial]) {
        groups[initial] = [];
      }

      groups[initial].push(brand);

      return groups;
    }, {});

    return { origin, other };
  },
  constants: ({ constants }) => constants,
  instagramAccounts: (state) => {
    return state.instagram_account;
  },
};
