<template>
  <div style="position: relative">
    <div class="container">
      <Breadcrumb :items="breadcrumbs" class="s-breadcrumb" />
    </div>
    <ItemSearchBox
      v-model="inputKeyword"
      class="sp-only"
      @search="handleSearch"
    />
    <ItemListMenu
      class="sp-only"
      :class="{ 'scrolled-to-content': scrolledToContent }"
      :condition-count="totalCount"
      @swithDisplay="handleSwithDisplay"
      @switchSort="showSortSelect = !showSortSelect"
      @switchConditions="handleSwitchConditions"
    >
      <ItemListSortSelect
        v-if="showSortSelect"
        :sort-options="sortOptions"
        :selected-sort="selectedSort"
        @sort="handleSort"
      />
    </ItemListMenu>
    <div class="container item-container">
      <div class="tile">
        <div class="tile">
          <article class="tile is-child sidemenu">
            <SideMenu
              :keyword.sync="inputKeyword"
              :input-conditions="inputConditions"
              @search="handleSearch"
              @reset="handleResetConditions"
            />
          </article>
          <article class="tile is-child contents">
            <div v-if="conditionTags.length > 0" class="container tag-list">
              <div class="condition-tag-title">絞り込み条件</div>
              <div class="columns is-mobile is-gapless">
                <TagList
                  :items="conditionTags"
                  @delete="handleDeleteConditionTag"
                />
              </div>
            </div>
            <div
              v-if="items && items.length"
              class="is-size-6 has-text-centered item-count"
            >
              <span class="search-result">絞り込み結果：</span>
              <span class="has-text-weight-bold is-size-6 mr-7">
                {{ pagination.total }}
              </span>
              items
              <h1 class="name has-text-centered">{{ seoH1 }}</h1>
              <div class="pulldown-nav">
                <Pulldown
                  :options="sortOptions"
                  :value="selectedSort"
                  @input="handleSort"
                />
              </div>
            </div>
            <DataNotFound v-if="!items.length && !$fetchState.pending">
              入力された条件で該当するものはありませんでした。<br />
              条件を変えて再度ご検索ください。
            </DataNotFound>
            <Goods
              class="search-goods"
              :items="items"
              :image-dispaly-mode="imageDispalyMode"
              @toggleFavorite="handleToggleFavorite"
            />
            <InfiniteLoading
              v-show="!isReachLastPage"
              ref="infiniteLoading"
              :key="componentKey"
              @reached-end="handleReachScrollEnd"
            />
          </article>
        </div>
      </div>
    </div>
    <ItemListNarrowDown
      v-if="!$fetchState.pending"
      v-show="showConditions"
      :inputs="inputConditions"
      :selected-category-count="selectedCategoryCount"
      :selected-store-brand-count="selectedStoreBrandCount"
      :selected-brand-count="selectedBrandCount"
      :selected-sales-type-count="selectedSalesTypeCount"
      :selected-color-count="selectedColorCount"
      @close="showConditions = false"
      @reset="handleResetConditions"
      @search="handleSearch"
    />
    <BaseDialog
      ref="loginAlertDialog"
      :has-ok="false"
      cancel-text="ログイン"
      @cancel="handleGoLogin"
    >
      <p class="login-alert-msg">
        お気に入りはログインすると使えるので<br />ログインしてください
      </p>
    </BaseDialog>
  </div>
</template>

<script>
import EventEmitter from "events";
import { mapGetters } from "vuex";
import throttle from "lodash.throttle";
import Goods from "@/components/organisms/Goods";
import SideMenu from "@/components/organisms/SideMenu";
import ItemSearchBox from "@/components/organisms/ItemSearchBox";
import ItemListMenu from "@/components/organisms/ItemListMenu";
import Breadcrumb from "@/components/organisms/Breadcrumb";
import TagList from "@/components/organisms/TagList";
import ItemListSortSelect from "@/components/organisms/ItemListSortSelect";
import ItemListNarrowDown from "@/components/organisms/ItemListNarrowDown";
import Pulldown from "@/components/atoms/Pulldown";
import InfiniteLoading from "@/components/molecules/InfiniteLoading";
import DataNotFound from "@/components/molecules/DataNotFound";
import BaseDialog from "@/components/atoms/BaseDialog";

export const sortOptions = [
  {
    id: "items.sales_period_from-desc",
    text: "新着順",
  },
  {
    id: "recommend-asc",
    text: "おすすめ順",
  },
  {
    id: "displayed_sale_price-desc",
    text: "価格が高い順",
  },
  {
    id: "displayed_sale_price-asc",
    text: "価格が安い順",
  },
];

export default {
  components: {
    Goods,
    SideMenu,
    Breadcrumb,
    ItemSearchBox,
    ItemListMenu,
    TagList,
    ItemListSortSelect,
    ItemListNarrowDown,
    Pulldown,
    InfiniteLoading,
    DataNotFound,
    BaseDialog,
  },
  watchQuery: true,
  scrollToTop: true,
  fetchOnServer: false,
  async fetch() {
    this.$store.commit("item/clear");
    await this.$store.dispatch(
      "item/fetch",
      this.castQueryParams(this.$route.query)
    );
    this.events.emit("fetched");
    this.componentKey += 1;
  },
  data() {
    return {
      sortOptions,
      inputConditions: this.getDefaultConditionInput(),
      inputKeyword: this.$route.query.q || "",
      selectedSort: this.$route.query.sort || sortOptions[0].id,
      events: new EventEmitter(),
      imageDispalyMode: false,
      showSortSelect: false,
      showConditions: false,
      yPosStatingContent: 173,
      scrolledToContent: false,
      scrollHander: throttle(() => {
        this.handleWindowScroll();
      }, 100),
      componentKey: 0,
    };
  },
  computed: {
    ...mapGetters({
      items: "item/data",
      enums: "master/enums",
      colors: "master/colors",
      brands: "master/brands",
      salesTypes: "master/salesTypes",
      onlineCategories: "master/onlineCategories",
      onlineCategoryLeafs: "master/onlineCategoryLeafs",
      pagination: "item/pagination",
      isReachLastPage: "item/isReachLastPage",
    }),
    storeBrands() {
      return this.enums.common__store_brand;
    },
    selectedCategoryCount() {
      return this.getSelectedConditions(this.inputConditions.onlineCategories)
        .length;
    },
    selectedStoreBrandCount() {
      return this.getSelectedConditions(this.inputConditions.storeBrands)
        .length;
    },
    selectedBrandCount() {
      return this.getSelectedConditions(this.inputConditions.brands).length;
    },
    selectedSalesTypeCount() {
      return this.getSelectedConditions(this.inputConditions.salesTypes).length;
    },
    selectedColorCount() {
      return this.getSelectedConditions(this.inputConditions.colors).length;
    },
    totalCount() {
      return (
        this.selectedCategoryCount +
        this.selectedStoreBrandCount +
        this.selectedBrandCount +
        this.selectedSalesTypeCount +
        this.selectedColorCount
      );
    },
    conditionTags() {
      const { query } = this.$route;

      const tags = this.getCurrentSelectedConditions();

      if (query.q) {
        tags.splice(0, 0, { id: query.q, label: query.q, type: "q" });
      }

      return tags;
    },
    onlineCategoryLeafDict() {
      return this.onlineCategoryLeafs.reduce((dict, category) => {
        return Object.assign(dict, { [category.id]: category });
      }, {});
    },
    selectedOnlineCategory() {
      const categoryIds = this.$route.query.online_category_id || [];
      const dict = this.onlineCategoryLeafDict;
      return categoryIds.map((id) => dict[id]).filter((item) => item);
    },
    selectedOnlineCategoryGroups() {
      return this.selectedOnlineCategory.reduce((groups, category) => {
        if (!groups[category.level]) {
          groups[category.level] = {};
        }

        groups[category.level][category.id] = { ...category };

        category.ancestors.forEach((ancestor) => {
          if (!groups[ancestor.level]) {
            groups[ancestor.level] = {};
          }

          groups[ancestor.level][ancestor.id] = { ...ancestor };
        });

        return groups;
      }, {});
    },
    seoBrandNames() {
      const storeBrands = this.getCurrentSelectedConditions("storeBrands");
      return storeBrands.map(({ label }) => label).join("・");
    },
    seoCategoryNames() {
      const onlineCategories = this.getCurrentSelectedConditions(
        "onlineCategories"
      );
      return onlineCategories.map(({ label }) => label).join("・");
    },
    seoTitle() {
      const parts = [];
      const { query } = this.$route;

      if (this.seoBrandNames) {
        parts.push(this.seoBrandNames);
      }

      if (this.seoCategoryNames) {
        if (parts.length > 0) {
          parts.push(" - ");
        }

        parts.push(this.seoCategoryNames);
      }

      if (parts.length === 0) {
        parts.push("商品一覧");
      } else if (
        query.main_store_brand !== undefined &&
        !Array.isArray(query.main_store_brand)
      ) {
        switch (this.selectedSort) {
          case sortOptions[0].id:
            parts.push(" - 新着商品");
            break;
          case sortOptions[1].id:
            parts.push(" - おすすめ商品");
            break;
        }
      }

      parts.push("｜YAMADAYA onlinestore");

      return parts.join("");
    },
    seoMetaDescription() {
      const parts = [];
      let lastMetaDescription =
        "はこちら。YAMADAYA公式オンライン通販サイトでは、オリジナルブランドから人気のセレクトブランドまで多数取り揃えております。";
      const { query } = this.$route;

      if (this.seoBrandNames) {
        parts.push(this.seoBrandNames);
      }

      if (this.seoCategoryNames) {
        if (parts.length > 0) {
          parts.push("の");
        }

        parts.push(this.seoCategoryNames + "をお探しの方");
      }

      if (parts.length === 0) {
        parts.push("商品一覧");
      } else if (
        query.main_store_brand !== undefined &&
        !Array.isArray(query.main_store_brand)
      ) {
        switch (this.selectedSort) {
          case sortOptions[0].id:
            lastMetaDescription =
              "の新着商品はこちら。YAMADAYA公式オンライン通販サイトでは、オリジナルブランドから人気のセレクトブランドまで多数取り揃えております。";
            break;
          case sortOptions[1].id:
            lastMetaDescription =
              "のおすすめ商品はこちら。YAMADAYA公式オンライン通販サイトでは、オリジナルブランドから人気のセレクトブランドまで多数取り揃えております。";
            break;
        }
      }

      parts.push(lastMetaDescription);

      return parts.join("");
    },
    breadcrumbs() {
      const items = [
        {
          id: 1,
          name: "YAMADAYA onlinestore",
          url: { name: "index", query: {} },
        },
      ];

      const { query } = this.$route;

      if (
        Array.isArray(query.main_store_brand) &&
        query.main_store_brand.length > 0
      ) {
        const data = this.getCurrentSelectedConditions("storeBrands");
        const newQuery = items[items.length - 1].url.query;

        items.push({
          id: items.length + 1,
          name: data.map(({ label }) => label).join("・"),
          url: {
            name: "items",
            query: {
              ...newQuery,
              main_store_brand: data.map(({ id }) => id),
            },
          },
        });
      }

      if (Array.isArray(query.brand_id) && query.brand_id.length > 0) {
        const data = this.getCurrentSelectedConditions("brands");
        const newQuery = items[items.length - 1].url.query;

        items.push({
          id: items.length + 1,
          name: data.map(({ label }) => label).join("・"),
          url: {
            name: "items",
            query: {
              ...newQuery,
              brand_id: data.map(({ id }) => id),
            },
          },
        });
      }

      if (
        Array.isArray(query.online_category_id) &&
        query.online_category_id.length > 0
      ) {
        const groups = this.selectedOnlineCategoryGroups;
        const levels = Object.keys(groups).sort((l1, l2) => l1 - l2);
        const newQuery = { ...(items[items.length - 1].url.query || {}) };

        const suffix =
          query.sales_type_id?.length > 0 || query.color_id?.length > 0
            ? ""
            : "）";

        levels.forEach((level) => {
          const dict = groups[level];
          const data = Object.keys(dict)
            .map((id) => dict[id])
            .sort((c1, c2) => c1.sort - c2.sort);

          items.push({
            id: items.length + 1,
            name:
              "対象商品（カテゴリー: " +
              data.map(({ name }) => name).join("・") +
              suffix,
            url: {
              name: "items",
              query: {
                ...newQuery,
                online_category_id: data.map(({ id }) => id),
              },
            },
            symbol: "，",
          });
        });
      }

      if (
        Array.isArray(query.sales_type_id) &&
        query.sales_type_id.length > 0
      ) {
        const data = this.getCurrentSelectedConditions("salesTypes");
        const newQuery = items[items.length - 1].url.query;

        const prefix = query.online_category_id?.length > 0 ? "" : "対象商品（";
        const suffix = query.color_id?.length > 0 ? "" : "）";

        items.push({
          id: items.length + 1,
          name:
            prefix +
            "販売タイプ: " +
            data.map(({ label }) => label).join("・") +
            suffix,
          url: {
            name: "items",
            query: {
              ...newQuery,
              sales_type_id: data.map(({ id }) => id),
            },
          },
          symbol: "，",
        });
      }

      if (Array.isArray(query.color_id) && query.color_id.length > 0) {
        const data = this.getCurrentSelectedConditions("colors");
        const newQuery = items[items.length - 1].url.query;

        const prefix =
          query.online_category_id?.length > 0 ||
          query.sales_type_id?.length > 0
            ? ""
            : "対象商品（";

        items.push({
          id: items.length + 1,
          name:
            prefix +
            "カラー: " +
            data.map(({ label }) => label).join("・") +
            "）",
          url: {
            name: "items",
            query: {
              ...newQuery,
              color_id: data.map(({ id }) => id),
            },
          },
          symbol: "，",
        });
      }

      if (items.length === 1) {
        items.push({
          id: 2,
          name: "商品一覧",
        });
      }

      delete items[items.length - 1].url;

      return items;
    },
    seoH1() {
      const parts = [];

      if (this.seoBrandNames) {
        parts.push(this.seoBrandNames);
      }

      if (this.seoCategoryNames) {
        if (parts.length > 0) {
          parts.push(" : ");
        }

        parts.push(this.seoCategoryNames);
      }

      if (parts.length === 0) {
        parts.push("商品一覧");
      }

      return parts.join("");
    },
  },
  watch: {
    "$route.query": "$fetch",
  },
  created() {
    this.inputConditions = this.getDefaultConditionInput();
  },
  beforeMount() {
    window.addEventListener("scroll", this.scrollHander);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.scrollHander);
  },
  methods: {
    handleDeleteConditionTag({ type, id }) {
      const query = this.createNewSearchQuery();

      if (Array.isArray(query[type])) {
        query[type] = query[type].filter((_id) => Number(_id) !== Number(id));
      } else {
        delete query[type];
      }

      this.$router.push({ path: "/items", query });
    },
    handleSwitchConditions() {
      if (this.showSortSelect) {
        this.showSortSelect = false;
      }
      this.showConditions = !this.showConditions;
    },
    handleSwithDisplay() {
      if (this.showSortSelect) {
        this.showSortSelect = false;
      }
      this.imageDispalyMode = !this.imageDispalyMode;
    },
    handleSort(sort) {
      const query = { ...this.$route.query, sort };
      this.$router.push({ path: "/items", query });
      this.selectedSort = sort;
      this.showSortSelect = false;
    },
    handleSearch() {
      const query = this.createNewSearchQuery();
      this.$router.push({ path: "/items", query });
    },
    handleResetConditions() {
      const inputs = this.inputConditions;
      Object.keys(inputs).forEach((groupName) => {
        Object.keys(inputs[groupName]).forEach((id) => {
          this.$set(this.inputConditions[groupName], id, false);
        });
      });
    },
    async handleReachScrollEnd($state) {
      if (this.$fetchState.pending) {
        await new Promise((resolve) => this.events.once("fetched", resolve));
        $state.loaded();
        return;
      }

      try {
        await this.$store.dispatch(
          "item/fetch",
          this.castQueryParams(this.$route.query)
        );

        if (this.isReachLastPage) {
          $state.complete();
        } else {
          $state.loaded();
        }
      } catch (error) {
        console.error(error);
        $state.error();
      }
    },
    handleWindowScroll() {
      this.scrolledToContent = window.scrollY > this.yPosStatingContent;
    },
    handleToggleFavorite(item) {
      if (!this.$auth.loggedIn) {
        this.$refs.loginAlertDialog.show();
        return;
      }

      this.$store.dispatch("item/updateFavorite", {
        id: item.id,
        isFavorite: !Number(item.is_favorite),
      });
    },
    resetLoadingState() {
      this.$refs.infiniteLoading.resetLoadingState();
    },
    getSelectedConditions(inputs) {
      return Object.keys(inputs).filter((key) => inputs[key]);
    },
    createNewSearchQuery() {
      const query = {
        ...this.$route.query,
        ...this.buildConditionParams(),
      };

      if (this.inputKeyword) {
        query.q = this.inputKeyword;
      } else {
        delete query.q;
      }

      return query;
    },
    createInputByQuery(values) {
      if (!values) {
        values = [];
      }

      return (Array.isArray(values) ? values : [values]).reduce(
        (inputs, value) => {
          return Object.assign(inputs, { [value]: true });
        },
        {}
      );
    },
    createDefaultCategoryInput(onlineCategoryIds) {
      if (!onlineCategoryIds) {
        onlineCategoryIds = [];
      }

      if (!Array.isArray(onlineCategoryIds)) {
        onlineCategoryIds = [onlineCategoryIds];
      }

      const leafIds = onlineCategoryIds.reduce((inputs, id) => {
        return Object.assign(inputs, { [id]: id });
      }, {});

      return this.createInputByQuery(Object.keys(leafIds));
    },
    getDefaultConditionInput() {
      const { query } = this.$route;

      return {
        onlineCategories: this.createDefaultCategoryInput(
          query.online_category_id
        ),
        storeBrands: this.createInputByQuery(query.main_store_brand),
        brands: this.createInputByQuery(query.brand_id),
        salesTypes: this.createInputByQuery(query.sales_type_id),
        colors: this.createInputByQuery(query.color_id),
      };
    },
    buildConditionParams() {
      const propNames = {
        onlineCategories: "online_category_id",
        storeBrands: "main_store_brand",
        brands: "brand_id",
        salesTypes: "sales_type_id",
        colors: "color_id",
      };

      return Object.keys(propNames).reduce((params, name) => {
        return Object.assign(params, {
          [propNames[name]]: this.getSelectedConditions(
            this.inputConditions[name]
          ),
        });
      }, {});
    },
    castQueryParams(query) {
      const paramNames = [
        "online_category_id",
        "main_store_brand",
        "brand_id",
        "sales_type_id",
        "color_id",
        "sort",
      ];

      const params = paramNames.reduce((castedQuery, name) => {
        if (!query[name]) {
          return castedQuery;
        }

        return Object.assign(castedQuery, {
          [name]:
            name === "sort" || Array.isArray(query[name])
              ? query[name]
              : [query[name]],
        });
      }, {});

      return Object.assign({}, query, params);
    },
    getCurrentSelectedConditions(keys = []) {
      const { query } = this.$route;

      const map = {
        onlineCategories: "online_category_id",
        storeBrands: "main_store_brand",
        brands: "brand_id",
        salesTypes: "sales_type_id",
        colors: "color_id",
      };

      if (!Array.isArray(keys)) {
        keys = [keys];
      }

      const conditions = (keys.length > 0 ? keys : Object.keys(map)).reduce(
        (conditions, getterName) => {
          const paramName = map[getterName];

          if (!query[paramName] || !Array.isArray(this[getterName])) {
            return conditions;
          }

          const params = Array.isArray(query[paramName])
            ? query[paramName]
            : [query[paramName]];

          const getter = this[getterName];
          const idName = paramName !== "main_store_brand" ? "id" : "value";
          const labelName =
            paramName !== "main_store_brand"
              ? paramName === "color_id"
                ? "display_name"
                : "name"
              : "label";

          return params.reduce((conditions, id) => {
            const item = getter.find(
              (item) => Number(item[idName]) === Number(id)
            );

            if (!item) {
              return conditions;
            }

            return conditions.concat([
              { id: item[idName], label: item[labelName], type: paramName },
            ]);
          }, conditions);
        },
        []
      );

      return conditions;
    },
    handleGoLogin() {
      this.$store.commit("route/setRedirectPath", this.$route.fullPath);
      this.$router.push({ name: "login" });
    },
  },
  head() {
    return {
      title: this.seoTitle,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.seoMetaDescription,
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.container {
  max-width: $desktop;
}
.sidemenu {
  @include touch {
    display: none;
  }
  @include desktop {
    flex: none;
    width: 25%;
    padding-right: 3%;
  }
}
.contents {
  @include touch {
    width: 100%;
  }
  @include desktop {
    flex: none;
    width: 75%;
  }
}
.item-container {
  margin-top: 10px;
}
.tag-list {
  margin: 0 8px;

  .condition-tag-title {
    margin-bottom: 4px;
  }
}
.scrolled-to-content {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10000;
  background: #fff;
  padding-top: 25px;
  margin-top: 0;
}
.item-count {
  position: relative;

  @include touch {
    margin-top: 6px;
    margin-bottom: 6px;
  }
  @include desktop {
    margin-bottom: 30px;
    padding-top: 12px;
  }

  .pulldown-nav {
    position: absolute;
    right: 0;
    top: 0;

    @include touch {
      display: none;
    }
  }
}
.search-result {
  @include touch {
    display: none;
  }
}
.s-breadcrumb {
  @include desktop {
    margin: 30px auto;
    font-size: 12px;
  }
}
.name {
  font-size: $size-5;
  margin: 20px 0;
}
.login-alert-msg {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}
</style>
