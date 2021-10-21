<template>
  <div class="wrap">
    <div class="narrowdown-menu">
      <div class="index mt-5 mb-5 has-text-centered narrowdown-menu-header">
        絞り込み条件<CancelButton
          class="cancel-button"
          @click="$emit('close')"
        />
      </div>
      <div class="full-divider-dark mb-4" />
      <div class="mb-4 is-size-6 has-text-centered">
        絞り込み結果 : {{ pagination.total }} items
      </div>
      <div class="full-divider" />
      <div class="columns is-mobile is-gapless">
        <div
          class="column select-button"
          :class="{ active: selectedMenu === MENU_TYPE_CATEGORY }"
        >
          <a
            class="is-size-7"
            @click.prevent="handleChangeMenu(MENU_TYPE_CATEGORY)"
          >
            <CategoryIcon />
            <p class="pt-3">カテゴリー</p>
          </a>
          <Badge v-if="selectedCategoryCount > 0" class="badge-count">{{
            selectedCategoryCount
          }}</Badge>
        </div>
        <div
          class="column select-button"
          :class="{ active: selectedMenu === MENU_TYPE_STORE_BRAND }"
        >
          <a
            class="is-size-7"
            @click.prevent="handleChangeMenu(MENU_TYPE_STORE_BRAND)"
          >
            <StoreIcon />
            <p class="pt-1">ストア<br />ブランド</p>
          </a>
          <Badge v-if="selectedStoreBrandCount > 0" class="badge-count">{{
            selectedStoreBrandCount
          }}</Badge>
        </div>
        <div
          class="column select-button"
          :class="{ active: selectedMenu === MENU_TYPE_BRAND }"
        >
          <a
            class="is-size-7"
            @click.prevent="handleChangeMenu(MENU_TYPE_BRAND)"
            ><BrandIcon />
            <p class="pt-2">ブランド</p>
          </a>
          <Badge v-if="selectedBrandCount > 0" class="badge-count">{{
            selectedBrandCount
          }}</Badge>
        </div>
        <div
          class="column select-button"
          :class="{ active: selectedMenu === MENU_TYPE_SALES_TYPE }"
        >
          <a
            class="is-size-7"
            @click.prevent="handleChangeMenu(MENU_TYPE_SALES_TYPE)"
          >
            <CartIcon />
            <p class="pt-2">販売タイプ</p>
          </a>
          <Badge v-if="selectedSalesTypeCount > 0" class="badge-count">{{
            selectedSalesTypeCount
          }}</Badge>
        </div>
        <div
          class="column select-button"
          :class="{ active: selectedMenu === MENU_TYPE_COLOR }"
        >
          <a class="is-size-7" @click="handleChangeMenu(MENU_TYPE_COLOR)">
            <ColorPickIcon />
            <p class="pt-2">カラー</p>
          </a>
          <Badge v-if="selectedColorCount > 0" class="badge-count">{{
            selectedColorCount
          }}</Badge>
        </div>
      </div>
      <div class="full-divider" />
    </div>

    <div class="toggle-area">
      <CategorySelect
        v-show="selectedMenu === MENU_TYPE_CATEGORY"
        ref="categorySelect"
        :inputs="inputs.onlineCategories"
        class="toggle-content"
      />
      <StoreBrandSelect
        v-show="selectedMenu === MENU_TYPE_STORE_BRAND"
        :inputs="inputs.storeBrands"
        class="toggle-content"
      />
      <BrandSelect
        v-show="selectedMenu === MENU_TYPE_BRAND"
        :inputs="inputs.brands"
        class="toggle-content"
      />
      <SalesTypeSelect
        v-show="selectedMenu === MENU_TYPE_SALES_TYPE"
        :inputs="inputs.salesTypes"
        class="toggle-content"
      />
      <ColorSelect
        v-show="selectedMenu === MENU_TYPE_COLOR"
        :inputs="inputs.colors"
        class="toggle-content"
      />
    </div>
    <div class="button-area pt-3">
      <div class="button-a mb-5">
        <NarrowDownButton
          class="mb-5"
          @search="handleSearch"
          @reset="handleReset"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CategoryIcon from "@/assets/images/icons/layer-icon.svg";
import StoreIcon from "@/assets/images/icons/store-icon.svg";
import BrandIcon from "@/assets/images/icons/brand-bag-icon.svg";
import CartIcon from "@/assets/images/icons/shopcart-icon.svg";
import ColorPickIcon from "@/assets/images/icons/two-column-icon.svg";
import NarrowDownButton from "@/components/organisms/NarrowDownButton";
import CancelButton from "@/components/atoms/CancelButton";
import ColorSelect from "@/components/pages/items/search/ColorSelect";
import CategorySelect from "@/components/pages/items/search/CategorySelect";
import StoreBrandSelect from "@/components/pages/items/search/StoreBrandSelect";
import SalesTypeSelect from "@/components/pages/items/search/SalesTypeSelect";
import BrandSelect from "@/components/pages/items/search/BrandSelect";
import Badge from "@/components/atoms/Badge";

const MENU_TYPE_CATEGORY = "category";
const MENU_TYPE_STORE_BRAND = "store_brand";
const MENU_TYPE_BRAND = "brand";
const MENU_TYPE_SALES_TYPE = "sales_type";
const MENU_TYPE_COLOR = "color";

export default {
  components: {
    NarrowDownButton,
    CancelButton,
    ColorSelect,
    CategorySelect,
    StoreBrandSelect,
    SalesTypeSelect,
    BrandSelect,
    Badge,
    CategoryIcon,
    StoreIcon,
    BrandIcon,
    CartIcon,
    ColorPickIcon,
  },
  props: {
    inputs: {
      type: Object,
      default: () => ({}),
    },
    selectedCategoryCount: {
      type: Number,
      default: 0,
    },
    selectedStoreBrandCount: {
      type: Number,
      default: 0,
    },
    selectedBrandCount: {
      type: Number,
      default: 0,
    },
    selectedSalesTypeCount: {
      type: Number,
      default: 0,
    },
    selectedColorCount: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      MENU_TYPE_CATEGORY,
      MENU_TYPE_STORE_BRAND,
      MENU_TYPE_BRAND,
      MENU_TYPE_SALES_TYPE,
      MENU_TYPE_COLOR,
      selectedMenu: MENU_TYPE_CATEGORY,
    };
  },
  computed: {
    ...mapGetters({
      items: "item/data",
      pagination: "item/pagination",
    }),
  },
  methods: {
    handleChangeMenu(menuType) {
      this.selectedMenu = menuType;
    },
    handleSearch(...args) {
      this.$emit("search", ...args);
      this.selectedMenu = MENU_TYPE_CATEGORY;
    },
    handleReset() {
      this.$refs.categorySelect.resetInput();
      this.$emit("reset");
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 10000;
  background-color: #fff;
  overflow-y: auto;

  .toggle-area {
    position: relative;
    width: 100%;
    margin-top: 172px;
    margin-bottom: 69px;
    background-color: #fff;
    height: 100%;
    min-height: 100%;
  }

  .button-area {
    position: fixed;
    width: 100%;
    bottom: 0;
    background: #fff;
  }

  .narrowdown-menu {
    height: auto;
    padding: 0;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    background-color: #fff;

    .index {
      font-size: 14px !important;
    }
    .columns {
      margin-bottom: 0 !important;
    }
    .select-button {
      height: 70px;
      background-color: $gray;
      text-align: center;
      flex: none;
      width: 20%;
      border-right: solid 1px #dbdbdb;
      position: relative;

      &.active {
        background-color: $white;
      }

      a {
        display: block;
        width: 100%;
        font-size: 8px;
        color: $black;
      }

      svg {
        margin-top: 10px;
        height: 20px;
      }

      .badge-count {
        position: absolute;
        top: 8px;
        right: 14px;
      }
    }
  }
}
.narrowdown-menu-header {
  position: relative;

  .cancel-button {
    display: block;
    position: absolute;
    right: 3%;
    top: 0;
    bottom: 0;
    margin: auto 0;
    background: none;
    height: 26px;
    width: 26px;
    max-width: 26px;
    max-height: 26px;
  }
}
</style>
