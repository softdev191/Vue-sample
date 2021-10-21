<template>
  <div>
    <aside class="menu">
      <ItemSearchBox
        :value="innerKeyword"
        @input="handleInputSearchKeyword"
        @search="handleSearch"
      />
      <MenuAccordion class="mb-6">
        <template v-slot:head>
          <div class="acd-label">検索条件を指定する</div>
        </template>
        <template v-slot:body>
          <div>
            <MenuAccordion2>
              <template v-slot:head>
                <div class="label">カテゴリー</div>
                <Badge v-if="selectedCategoryCount > 0" class="badge-count">{{
                  selectedCategoryCount
                }}</Badge>
              </template>
              <template v-slot:body>
                <div>
                  <CategoryTreeSelect
                    :tree="onlineCategoryTree"
                    :values="inputConditions.onlineCategories"
                    :tops="selectedCategoryCounts"
                    @input="(data) => handleCategoryChange(data)"
                    @all="(data) => handleCategoryAll(data)"
                  />
                </div>
              </template>
            </MenuAccordion2>
            <MenuAccordion2>
              <template v-slot:head>
                <div class="label">ストアブランド</div>
                <Badge v-if="selectedStoreBrandCount > 0" class="badge-count">{{
                  selectedStoreBrandCount
                }}</Badge>
              </template>
              <template v-slot:body>
                <div>
                  <ul class="menu-list columns">
                    <li
                      v-for="brand in storeBrands"
                      :key="brand.value"
                      class="column is-half"
                    >
                      <Checkbox
                        :id="`pc-store-brand-${brand.value}`"
                        v-model="inputConditions.storeBrands[brand.value]"
                        :text="brand.label"
                      />
                    </li>
                  </ul>
                </div>
              </template>
            </MenuAccordion2>
            <MenuAccordion2>
              <template v-slot:head>
                <div class="label">ブランド</div>
                <Badge v-if="selectedBrandCount > 0" class="badge-count">{{
                  selectedBrandCount
                }}</Badge>
              </template>
              <template v-slot:body>
                <div>
                  <h5 class="b-section-title">オリジナルブランド</h5>
                  <template v-for="category in brandCategories">
                    <template v-if="brandGroups.origin[category.value]">
                      <div :key="category.key" class="b-block">
                        <div
                          v-if="category.key !== 'Nothing'"
                          class="b-block-title"
                        >
                          {{ brandCategoryLabels[category.value] }}
                        </div>
                        <ul class="menu-list columns">
                          <li
                            v-for="option in brandGroups.origin[category.value]"
                            :key="option.id"
                            class="column is-half"
                          >
                            <Checkbox
                              :id="`pc-brand-${option.id}`"
                              v-model="inputConditions.brands[option.id]"
                              :text="option.name"
                            />
                          </li>
                        </ul>
                      </div>
                    </template>
                  </template>
                  <h4 class="b-section-title">その他のブランド</h4>
                  <div
                    v-for="initial in brandInitials"
                    :key="initial"
                    class="b-block other"
                  >
                    <div class="b-block-title">
                      {{ initial }}
                    </div>
                    <ul class="menu-list columns">
                      <li
                        v-for="option in brandGroups.other[initial]"
                        :key="option.id"
                        class="column is-one-quarter"
                      >
                        <Checkbox
                          :id="`pc-brand-${option.id}`"
                          v-model="inputConditions.brands[option.id]"
                          :text="option.name"
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              </template>
            </MenuAccordion2>
            <MenuAccordion2>
              <template v-slot:head>
                <div class="label">販売タイプ</div>
                <Badge v-if="selectedSalesTypeCount > 0" class="badge-count">{{
                  selectedSalesTypeCount
                }}</Badge>
              </template>
              <template v-slot:body>
                <div>
                  <ul class="menu-list columns">
                    <li
                      v-for="salesType in salesTypes"
                      :key="salesType.id"
                      class="column is-half"
                    >
                      <Checkbox
                        :id="`pc-sales-type-${salesType.id}`"
                        v-model="inputConditions.salesTypes[salesType.id]"
                        :text="salesType.name"
                      />
                    </li>
                  </ul>
                </div>
              </template>
            </MenuAccordion2>
            <MenuAccordion2>
              <template v-slot:head>
                <div class="label">カラー</div>
                <Badge v-if="selectedColorCount > 0" class="badge-count">{{
                  selectedColorCount
                }}</Badge>
              </template>
              <template v-slot:body>
                <div>
                  <ul class="menu-list columns">
                    <li
                      v-for="color in colors"
                      :key="color.id"
                      class="column is-half"
                    >
                      <Checkbox
                        :id="`pc-color-${color.id}`"
                        v-model="inputConditions.colors[color.id]"
                        :text="color.display_name"
                      />
                    </li>
                  </ul>
                </div>
              </template>
            </MenuAccordion2>
            <ButtonWrapper class="mt-3" theme="full">
              <Button theme="dark" @click="handleSearch"
                >絞り込み結果を見る</Button
              >
              <Button theme="light" @click="handleResetAllConditions"
                >全ての条件を解除</Button
              >
            </ButtonWrapper>
          </div>
        </template>
        <template v-slot:footer>
          <div class="acd-label close has-text-centered">閉じる</div>
          <div class="angle-close"></div>
        </template>
      </MenuAccordion>
      <p class="menu-label">STORE BRAND</p>
      <ul class="menu-list">
        <li
          v-for="(storeBrand, index) in storeBrands"
          :key="index"
          class="l-li"
        >
          <nuxt-link
            :to="{
              name: 'items',
              query: { main_store_brand: [storeBrand.value] },
            }"
            class="l-link"
            ><div class="l-label">{{ storeBrand.label }}</div></nuxt-link
          >
        </li>
      </ul>
      <p class="menu-label">CATEGORY</p>
      <CategoryTreeNavi :tree="onlineCategoryTree" :dict="onlineCategoryDict" />
    </aside>
    <CategorySelectDialog
      ref="categorySelectDialog"
      @enter="handleEnterCategory"
    />
    <BrandSelectDialog ref="brandSelectDialog" @enter="handleEnterBrand" />
  </div>
</template>

<script>
import Checkbox from "@/components/atoms/Checkbox.vue";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import ItemSearchBox from "@/components/organisms/ItemSearchBox.vue";
import MenuAccordion from "@/components/molecules/MenuAccordion.vue";
import MenuAccordion2 from "@/components/molecules/MenuAccordion2.vue";
import CategorySelectDialog from "@/components/organisms/CategorySelectDialog";
import BrandSelectDialog from "@/components/organisms/BrandSelectDialog";
import CategoryTreeNavi from "@/components/molecules/CategoryTreeNavi";
import CategoryTreeSelect from "@/components/molecules/CategoryTreeSelect";

export default {
  name: "SideMenu",
  components: {
    Checkbox,
    Button,
    ButtonWrapper,
    ItemSearchBox,
    MenuAccordion,
    MenuAccordion2,
    CategorySelectDialog,
    BrandSelectDialog,
    CategoryTreeNavi,
    CategoryTreeSelect,
    Badge,
  },
  props: {
    keyword: {
      type: String,
      default: "",
    },
    inputConditions: {
      type: Object,
      default: () => ({
        onlineCategories: {},
        storeBrands: {},
        brands: {},
        salesTypes: {},
        colors: {},
      }),
    },
  },
  data() {
    return {
      keywordCache: "",
      categoryGroup: {},
    };
  },
  computed: {
    onlineCategoryTree() {
      return this.$store.getters["master/onlineCategoryTree"];
    },
    onlineCategoryDict() {
      return this.$store.getters["master/onlineCategoryDict"];
    },
    storeBrands() {
      return this.$store.getters["master/enums"].common__store_brand;
    },
    salesTypes() {
      return this.$store.getters["master/salesTypes"];
    },
    colors() {
      return this.$store.getters["master/colors"];
    },
    selectedCategoryCount() {
      return this.getSelectedConditions(this.inputConditions.onlineCategories)
        .length;
    },
    selectedCategoryCounts() {
      const tree = this.onlineCategoryTree;
      const values = this.inputConditions.onlineCategories;
      return tree.map((subTree) => {
        let selectedCt = 0;
        Object.keys(this.onlineCategoryDict).forEach((key) => {
          const leaf = this.onlineCategoryDict[key];
          if (leaf.root_id === subTree.id && values[leaf.id]) {
            selectedCt += 1;
          }
        });
        return selectedCt;
      });
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
    isItemSearchPage() {
      return this.$route.name === "items";
    },
    innerKeyword() {
      return this.isItemSearchPage ? this.keyword : this.keywordCache;
    },
    brandCategories() {
      return this.$store.getters["master/enums"].brand__category;
    },
    brandGroups() {
      return this.$store.getters["master/brandGroups"];
    },
    brandCategoryLabels() {
      return this.brandCategories.reduce((labels, category) => {
        return Object.assign(labels, { [category.value]: category.label });
      }, {});
    },
    brandInitials() {
      const { other } = this.$store.getters["master/brandGroups"];
      return Object.keys(other).sort();
    },
  },
  methods: {
    handleSearch() {
      if (this.isItemSearchPage) {
        this.$emit("search");
      } else {
        const query = this.createNewSearchQuery();
        this.$router.push({ path: "/items", query });
      }
    },
    handleCategoryChange(data) {
      this.$set(this.inputConditions.onlineCategories, data.obj.id, data.value);
    },
    handleCategoryAll(data) {
      const tree = this.onlineCategoryTree[data.idx];
      const selectAllTree = (node) => {
        if (node.is_leaf || node.level === 3) {
          this.$set(this.inputConditions.onlineCategories, node.id, data.value);
        } else {
          node.children.forEach((child) => {
            selectAllTree(child);
          });
        }
      };
      selectAllTree(tree);
    },
    handleEnterCategory(inputs) {
      this.$set(this.inputConditions, "onlineCategories", inputs);
    },
    handleEnterBrand(inputs) {
      this.$set(this.inputConditions, "brands", inputs);
    },
    handleOpenCategorySelectDialog() {
      this.$refs.categorySelectDialog.open({
        inputs: this.inputConditions.onlineCategories,
      });
    },
    handleOpenBrandSelectDialog() {
      this.$refs.brandSelectDialog.open({
        inputs: this.inputConditions.brands,
      });
    },
    handleResetAllConditions() {
      this.$emit("reset");
      this.$emit("update:keyword", "");
      this.$refs.categorySelectDialog.resetInput();
      this.handleResetConditions();
    },
    handleInputSearchKeyword(value) {
      this.keywordCache = value;
      this.$emit("update:keyword", value);
    },
    handleResetConditions() {
      const inputs = this.inputConditions;
      Object.keys(inputs).forEach((groupName) => {
        Object.keys(inputs[groupName]).forEach((id) => {
          this.$set(this.inputConditions[groupName], id, false);
        });
      });
    },
    getSelectedConditions(inputs) {
      return Object.keys(inputs).filter((key) => inputs[key]);
    },
    createNewSearchQuery() {
      const query = {
        ...this.buildConditionParams(),
      };

      if (this.keywordCache) {
        query.q = this.keywordCache;
      } else {
        delete query.q;
      }

      return query;
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
  },
};
</script>

<style lang="scss" scoped>
.menu {
  padding-top: 0;
}
.menu-label {
  border-bottom: solid 1px #a7a7a7;
  padding: 0 5px;
  color: #4a4a4a;
  margin: 30px 5px 0 5px;
  margin-bottom: 0 !important;
  font-weight: 700;
  font-size: 18px;
}
.menu-list {
  .acd-button {
    position: relative;
    padding: 0;
  }
  .acd-label {
    border-bottom: solid 1px #dbdbdb;
    padding: 15px 5px 15px 5px;
    margin: 0 5px 0 5px;
    font-weight: 400;
  }
  .l-li {
    border-bottom: solid 1px #dbdbdb;
    .l-link {
      padding-top: 0;
      padding-bottom: 0;
      .l-label {
        padding: 12px 0 12px 0;
        font-size: 14px;
      }
    }
  }
}

.menu-list.columns {
  flex-wrap: wrap;
  padding: 8px 14px 14px 14px;

  li {
    font-size: 12px;
    position: relative;
    padding: 0;

    .label {
      border-bottom: solid 1px #dbdbdb;
      padding: 15px 5px;
      margin: 0 5px 0 5px;
      font-weight: 400;

      &.close {
        margin-right: 20px;
        border: none;
      }
    }
    &::v-deep .checkbox {
      .label {
        padding: 15px 0 10px 20px;
        font-size: 10px;
        border-bottom: 0;
        font-weight: normal;

        &::before {
          top: 15px;
        }
        &::after {
          top: 17px;
        }
      }
    }
  }
}
.buttons {
  justify-content: space-between;
  padding: 0 10px;
}
.button {
  width: 100%;
  height: 36px;
  border-radius: 0;
  margin: 10px 0 10px 0 !important;
  &.light {
    background-color: #fff;
    border-color: #000;

    &:hover {
      background-color: #6c6c6c;
      color: #fff;
      border-color: #6c6c6c;
    }
  }
  &.dark {
    background-color: #6c6c6c;
    color: #fff;
    border-color: #6c6c6c;
    &:hover {
      background-color: #fff;
      border-color: #000;
      color: #000;
    }
  }
  &:hover {
    background-color: #fff;
    border-color: #000;
    color: #000;
  }
}
.angle-up {
  border: solid black;
  border-width: 0 1px 1px 0;
  display: inline-block;
  position: absolute;
  padding: 4px;
  transform: rotate(225deg);
  -webkit-transform: rotate(225deg);
  top: 20px;
  right: 10px;
}
.angle-down {
  border: solid black;
  border-width: 0 1px 1px 0;
  display: inline-block;
  position: absolute;
  padding: 4px;
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  top: 20px;
  right: 10px;
}
.angle-right {
  border: solid black;
  border-width: 0 1px 1px 0;
  display: inline-block;
  position: absolute;
  padding: 4px;
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  top: 18px;
  right: 10px;
}
.angle-close {
  border: solid black;
  border-width: 0 1px 1px 0;
  display: inline-block;
  position: absolute;
  padding: 4px;
  transform: rotate(225deg);
  -webkit-transform: rotate(225deg);
  top: 20px;
  right: 50px;
}
.badge-count {
  position: absolute;
  top: 14px;
  right: 25px;
}
.all-check {
  width: 256px;
}
.b-section-title {
  font-size: 12px;
  border-bottom: 1px solid #000;
  padding: 0 15px;
}
</style>
