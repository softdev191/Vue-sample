<template>
  <div style="position: relative">
    <div v-if="item" class="fixed-container">
      <Breadcrumb :items="breadcrumbs" />
      <div class="over_hidden">
        <div class="item-main--wrapper">
          <div class="item-img-slider--wrapper">
            <CarouselOfItem
              :item-images="item.item_images"
              class="mb-5"
              @clickMainImage="handleClickMainImage"
            >
              <template #overlay>
                <SoldOutOverlay v-if="item.is_sold_out" class="sold-out" />
              </template>
            </CarouselOfItem>
            <ItemImageCarouselModal ref="itemImageCarouselModal" />
          </div>
          <div class="item-info--wrapper">
            <ErrorBox
              v-if="error"
              title="カート投入失敗"
              class="pc-only cart-error"
            >
              {{ error.message }}
            </ErrorBox>
            <div class="mb-3">
              <template v-for="(salesType, index) in item.sales_types">
                <span
                  :key="`${salesType.id}-tag`"
                  class="tags"
                  :style="{ color: salesType.text_color }"
                >
                  {{ salesType.name }}
                </span>
                <span
                  v-if="index < item.sales_types.length - 1"
                  :key="`${salesType.id}-sep`"
                  class="tags-separator"
                  >/</span
                >
              </template>
            </div>
            <div v-if="item.brand" class="brand mb-1">
              {{ item.brand.name }}
            </div>
            <h1 class="name mb-1">{{ seoH1 }}</h1>
            <div class="mdce mb-1">
              商品番号：【{{ item.maker_product_number }}】
            </div>
            <div
              v-if="
                item.is_reservation &&
                item.applied_reservation.expected_arrival_date
              "
              class="mdce mb-1"
            >
              お届け予定：{{ item.applied_reservation.expected_arrival_date }}
            </div>
            <template
              v-if="
                item.retail_price > item.displayed_sale_price &&
                item.can_display_original_price
              "
            >
              <div class="price mb-1">
                <small class="original-price"
                  ><s>{{ yen(item.retail_price) }}(税込)</s></small
                >
                <span class="sale-price"
                  >{{ yen(item.displayed_sale_price) }}(税込)</span
                >
              </div>
            </template>
            <template v-else>
              <div class="price mb-1">
                {{ yen(item.displayed_sale_price) }}(税込)
              </div>
            </template>

            <div class="columns is-mobile is-gapless return-wrapper">
              <div v-if="item.returnable" class="return">返品可</div>
              <div v-else class="return unreturnable">返品不可</div>
              <div class="about-return">
                <InformationMessage dialog-title="返品について">
                  <template v-slot:message>
                    「返品可」の商品は、お客様都合での返品を承ることが可能です。<br />
                    ※ご返送の際の送料はお客様にご負担(元払い)いただいております。<br /><br />
                    「返品不可」の商品は、お客様都合での返品が出来ません。<br />
                    ※当店では、お客様都合によるサイズ交換、カラー交換等のご交換対応は行っておりません。<br />
                    予めご了承いただきますようお願いします。<br /><br />
                    -------<br />
                    ご注文完了後１時間以内は、ご注文キャンセルが可能です。<br />
                    ご希望の場合は[会員メニュー]の[購入履歴・発送状況・キャンセルページ]の「注文をキャンセルする」からお手続きください。<br /><br />
                    ※キャンセルは注文単位です。<br />
                    ※複数点ご注文の場合の一部商品キャンセルは出来ません。ご注文をキャンセル後、再度ご注文をし直してください。（キャンセルした商品分の在庫はショップに戻りますが、人気商品は直ぐに売り切れてしまう場合がございます。）<br />
                    ※１時間経過したご注文のキャンセルはお受けしておりません。<br />
                    -------
                  </template>
                </InformationMessage>
              </div>
            </div>
            <AddToCartList
              :item="item"
              :error="cartError"
              :cartPending="cartPending"
              @addToCart="onPutItemIntoCart"
            />
            <ButtonWrapper theme="full">
              <Button
                class="add-to-cart-button"
                theme="dark"
                :disabled="item.is_sold_out"
                @click="onClickOpenCartDialog"
              >
                {{ item.is_sold_out ? "SOLD OUT" : "カートに入れる" }}
              </Button>
            </ButtonWrapper>
            <AddToCartDialog
              ref="addToCartDialog"
              :item="item"
              :error="error"
              :cart-error="cartError"
              :cartPending="cartPending"
              @addToCart="onPutItemIntoCart"
              @close="handleCloseCartDialog"
            />
            <ButtonWrapper theme="full">
              <Button theme="light" @click="handleShowStoreList"
                >店頭在庫を見る</Button
              >
            </ButtonWrapper>
            <ButtonWrapper theme="full">
              <Button
                theme="favorite"
                :on="item.is_favorite"
                :pending="favoritePending"
                @click="handleClickFavorite"
              >
                <template>{{
                  item.is_favorite ? "お気に入り登録済" : "お気に入り登録"
                }}</template>
                <template #icon="{ on }"
                  ><Favorite :is-added="on" theme="dark"
                /></template>
              </Button>
            </ButtonWrapper>

            <ThreeMenu :items="descriptionTabs" class="description-tabs">
              <template #after="{ activeTabIndex }">
                <div
                  v-if="descriptionTabs[activeTabIndex].id === 'size'"
                  class="has-text-right size-link-wrapper"
                >
                  <nuxt-link
                    :to="{ name: 'helps', params: { id: helps.SIZE } }"
                    class="size-link"
                    >サイズガイドはこちら</nuxt-link
                  >
                  <div
                    class="content has-text-left"
                    v-html="item.size_caution"
                  ></div>
                </div>
              </template>
            </ThreeMenu>
            <div class="content has-text-weight-bold is-size-6 mt-4">
              <nuxt-link
                :to="{
                  name: 'contact',
                  query: {
                    product_number: item.product_number,
                  },
                }"
                >お問い合わせ番号：{{ item.product_number }}</nuxt-link
              >
            </div>
            <nuxt-link
              :to="{
                name: 'items',
                query: {
                  main_store_brand: [item.main_store_brand],
                  sort: 'items.sales_period_from-desc',
                },
              }"
            >
              <Button theme="light" class="mb-6">
                ストアブランドの商品一覧はこちら
              </Button>
            </nuxt-link>
          </div>
        </div>
      </div>
      <div class="content is-size-5 mb-1">コーディネートに使用したアイテム</div>
      <div class="divider mb-5" />
      <Goods
        :items="usedSameStylings"
        @toggleFavorite="handleToggleSideItemFavorite"
      />

      <div class="content is-size-5 mb-1">スタイリング</div>
      <div class="divider mb-5" />
      <Stylings
        :items="stylings"
        :horizonal="true"
        :is-autoloading="true"
        @reached-end="handleReachEndOfStylingList"
      />

      <div class="content is-size-5 mb-1">おすすめ商品</div>
      <div class="divider mb-5" />
      <Goods
        :items="recommends"
        @toggleFavorite="handleToggleSideItemFavorite"
      />
    </div>
    <RedisplayRequestDialog ref="redisplayRequestDialog" />
    <RedisplayRequestCancelDialog ref="redisplayRequestCancelDialog" />
    <ItemStoreListDialog
      ref="itemStoreListDialog"
      @buy="handleBuyFromStoreList"
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
    <nuxt-child />
  </div>
</template>

<script>
import EventEmitter from "events";
import * as helps from "@/constants/helps";
import CarouselOfItem from "@/components/organisms/CarouselOfItem.vue";
import Goods from "@/components/organisms/Goods";
import Stylings from "@/components/organisms/Stylings";
import Breadcrumb from "@/components/organisms/Breadcrumb";
import ThreeMenu from "@/components/organisms/ThreeMenu";
import Button from "@/components/atoms/Button.vue";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Favorite from "@/components/atoms/Favorite";
import AddToCartList from "@/components/organisms/AddToCartList";
import AddToCartDialog from "@/components/organisms/AddToCartDialog";
import ItemImageCarouselModal from "@/components/organisms/ItemImageCarouselModal";
import RedisplayRequestDialog from "@/components/organisms/RedisplayRequestDialog";
import RedisplayRequestCancelDialog from "@/components/organisms/RedisplayRequestCancelDialog";
import ItemStoreListDialog from "@/components/organisms/ItemStoreListDialog";
import SoldOutOverlay from "@/components/atoms/SoldOutOverlay";
import InformationMessage from "@/components/molecules/InformationMessage";
import { mapState, mapGetters } from "vuex";
import { yen, formatNumber } from "@/utils/format";
import ErrorBox from "@/components/atoms/ErrorBox";
import { extractFlatValidationError } from "@/plugins/vee-validate";
import BaseDialog from "@/components/atoms/BaseDialog";
import * as httpStatusCode from "@/constants/httpStatusCode";
import { isNotFoundError } from "@/plugins/axios";

const DEFAULT_ITEM_COUNT = 1;

export default {
  components: {
    ErrorBox,
    CarouselOfItem,
    Goods,
    Stylings,
    Breadcrumb,
    Button,
    ButtonWrapper,
    Favorite,
    ThreeMenu,
    AddToCartList,
    AddToCartDialog,
    ItemImageCarouselModal,
    RedisplayRequestDialog,
    RedisplayRequestCancelDialog,
    ItemStoreListDialog,
    SoldOutOverlay,
    BaseDialog,
    InformationMessage,
  },
  scrollToTop: true,
  fetchOnServer: false,
  validate({ params }) {
    return /^[0-9]+$/.test(params.product_number);
  },
  fetch() {
    const productNumber = this.$route.params.product_number;

    if (this.$route.name !== "items-detail-product_number-preview") {
      this.$store.dispatch("item/fetchUsedSameStylings", { productNumber });
    }

    this.$store
      .dispatch("styling/fetchCursor", {
        product_number: productNumber,
      })
      .then(() => {
        this.events.emit("stylingFeached");
        this.stylingFirstFetched = true;
      });
    this.$store.dispatch("redisplayRequest/fetch", { productNumber });
  },
  async asyncData({ store, route, error }) {
    if (route.name !== "items-detail-product_number") {
      return;
    }
    const productNumber = route.params.product_number;
    await Promise.all([
      store
        .dispatch("item/get", {
          productNumber,
          useCache: false,
        })
        .catch((localError) => {
          if (isNotFoundError(localError)) {
            return error({ statusCode: httpStatusCode.NOT_FOUND });
          }

          return error({
            statusCode: httpStatusCode.INTERNAL_SERVER_ERROR,
          });
        }),
      store
        .dispatch("item/fetchRecommends", {
          productNumber,
          useCache: true,
        })
        .catch((error) => {
          console.error(error);
        }),
    ]);
  },
  data() {
    return {
      favoritePending: false,
      stylingFirstFetched: false,
      events: new EventEmitter(),
      helps,
      cartError: {
        id: "",
        message: "",
        isShow: false,
      },
      error: null,
      cartPending: false,
    };
  },
  computed: {
    ...mapState({
      cartStatuses(state, getters) {
        return getters["master/enums"].cart__status;
      },
    }),
    ...mapGetters({
      item: "item/detail",
      enums: "master/enums",
      stylings: "styling/data",
      recommends: "item/recommends",
      usedSameStylings: "item/usedSameStylings",
      redisplayRequestedSku: "redisplayRequest/dict",
    }),
    id() {
      return this.$route.params.id;
    },
    isClosedMarket() {
      return (
        this.$route.name === "items-detail-product_number-closed-markets-id"
      );
    },
    cartStatuses() {
      return this.$store.getters["master/enums"].cart__status;
    },
    cartStatusEnum() {
      return this.cartStatuses.reduce((obj, { key, value }) => {
        return Object.assign(obj, { [key]: value });
      }, {});
    },
    mainStoreBrand() {
      return (
        this.enums.common__store_brand.find(
          ({ value }) => Number(value) === this.item.main_store_brand
        ) || {}
      );
    },
    itemDiscountTypeKv() {
      return this.enums.item__discount_type.reduce((kv, type) => {
        return { ...kv, [type.key]: type.value };
      }, {});
    },
    selectedOnlineCategoryGroups() {
      const onlineCategories = this.item.online_categories;
      if (!Array.isArray(onlineCategories)) {
        return {};
      }
      return onlineCategories.reduce((groups, category) => {
        if (!groups[category.level]) {
          groups[category.level] = {};
        }
        groups[category.level][category.id] = { ...category };
        (category.ancestors || []).forEach((ancestor) => {
          if (!groups[ancestor.level]) {
            groups[ancestor.level] = {};
          }
          groups[ancestor.level][ancestor.id] = { ...ancestor };
        });
        return groups;
      }, {});
    },
    descriptionTabs() {
      const item = this.item;
      if (!item) {
        return [];
      }
      return [
        {
          id: "description",
          title: "アイテム説明",
          content: item.description,
        },
        {
          id: "size",
          title: "サイズ",
          content: item.size_optional_info,
        },
        {
          id: "material",
          title: "アイテム詳細",
          content: [item.material_info, item.material_caution]
            .filter((item) => item)
            .join(""),
        },
      ];
    },
    isSeoSaleItem() {
      if (
        Number(this.item.displayed_discount_type) !==
          Number(this.itemDiscountTypeKv.None) &&
        this.item.can_display_original_price
      ) {
        return true;
      }
      return !this.item.item_details.some((itemDetail) => {
        return (
          Number(itemDetail.applicable_cart_status) !==
          Number(this.cartStatusEnum.Reserve)
        );
      });
    },
    seoTitle() {
      if (!this.item) {
        return "";
      }

      return `${this.item.display_name} - ${this.mainStoreBrand.label}｜YAMADAYA onlinestore`;
    },
    seoMetaDescription() {
      if (!this.item) {
        return "";
      }

      const text = `${this.item.description} YAMADAYA公式オンライン通販サイトでは、オリジナルブランドから人気のセレクトブランドまで多数取り揃えております。`;
      if (!this.isSeoSaleItem) {
        return text;
      }
      return "セール中！" + text;
    },
    seoH1() {
      if (!this.item) {
        return "";
      }

      return this.item.display_name;
    },
    breadcrumbs() {
      if (!this.item) {
        return "";
      }

      const items = [
        {
          id: 1,
          name: "YAMADAYA onlinestore",
          url: { name: "index", query: {} },
        },
        {
          id: 2,
          name: this.mainStoreBrand.label,
          url: {
            name: "items",
            query: {
              main_store_brand: [this.mainStoreBrand.value],
            },
          },
        },
      ];
      if (this.item.brand) {
        items.push({
          id: 3,
          name: this.item.brand.name,
          url: {
            name: "items",
            query: {
              main_store_brand: [this.mainStoreBrand.value],
              brand_id: [this.item.brand.id],
            },
          },
        });
      }
      if (this.item.online_categories.length > 0) {
        const groups = this.selectedOnlineCategoryGroups;
        const levels = Object.keys(groups).sort((l1, l2) => l1 - l2);
        const newQuery = { ...(items[items.length - 1].url.query || {}) };
        levels.forEach((level) => {
          const dict = groups[level];
          const data = Object.keys(dict)
            .map((id) => dict[id])
            .sort((c1, c2) => c1.id - c2.id);
          items.push({
            id: items.length + 1,
            name: data[0].name,
            url: {
              name: "items",
              query: {
                ...newQuery,
                online_category_id: data[0].id,
              },
            },
          });
        });
      }
      items.push({
        id: items.length + 1,
        name: this.item.display_name,
      });
      return items;
    },
  },
  methods: {
    yen(...args) {
      return yen(...args);
    },
    formatNumber(...args) {
      return formatNumber(...args);
    },
    onClickOpenCartDialog() {
      this.$refs.addToCartDialog.show();
    },
    /**
     * カートに入れる(ポップアップ)
     *
     * @returns {Promise<void>}
     */
    async onPutItemIntoCart(productNumber, itemDetail) {
      this.cartPending = true;
      try {
        await this.addToCart(productNumber, itemDetail);
        this.error = null;
      } catch (error) {
        console.error(error);
        const messages = extractFlatValidationError(error);
        this.error = {
          message: messages[0],
        };
      }
      this.cartPending = false;
    },
    async addToCart(productNumber, itemDetail) {
      const param = {
        product_number: productNumber,
        color_id: itemDetail.color.id,
        size_id: itemDetail.size.id,
        status: itemDetail.applicable_cart_status,
        count: DEFAULT_ITEM_COUNT,
      };
      if (this.isClosedMarket) {
        param.closed_market_id = itemDetail.applied_closed_market.id;
      }
      let response = {};
      const cartStatusEnum = this.cartStatusEnum;
      switch (Number(itemDetail.applicable_cart_status)) {
        case cartStatusEnum.Add:
        case cartStatusEnum.Reserve:
        case cartStatusEnum.Order:
          response = await this.$store.dispatch("cart/store", param);
          if (response.status >= 400) {
            throw response;
          }
          this.$router.push("/cart");
          break;
        case cartStatusEnum.RestockRequest:
          if (!this.redisplayRequestedSku[itemDetail.id]) {
            this.$refs.redisplayRequestDialog.open({
              item: this.item,
              itemDetail,
            });
          } else {
            this.$refs.redisplayRequestCancelDialog.open({
              itemDetail,
            });
          }
          break;
        default:
      }
      this.$refs.addToCartDialog.hide();
    },
    handleCloseCartDialog() {
      this.cartError = {
        id: "",
        message: "",
        isShow: false,
      };
      this.error = null;
    },
    async handleClickFavorite() {
      const item = this.item;
      if (!this.$auth.loggedIn) {
        this.$refs.loginAlertDialog.show();
        return;
      }
      this.favoritePending = true;
      await this.$store.dispatch("item/updateFavorite", {
        id: item.id,
        isFavorite: !Number(item.is_favorite),
      });
      this.favoritePending = false;
    },
    handleToggleSideItemFavorite(item) {
      if (!this.$auth.loggedIn) {
        this.$store.commit("route/setRedirectPath", this.$route.fullPath);
        this.$router.push({ name: "login" });
        return;
      }
      this.$store.dispatch("item/updateFavorite", {
        id: item.id,
        isFavorite: !Number(item.is_favorite),
      });
    },
    async handleReachEndOfStylingList($state) {
      try {
        if (!this.stylingFirstFetched) {
          await new Promise((resolve) =>
            this.events.once("stylingFeached", resolve)
          );
          $state.loaded();
          return;
        }
        await this.$store.dispatch("styling/nextPage", {
          params: { product_number: this.item.productNumber },
        });
        if (this.$store.getters["styling/cursor"].isReachedEnd) {
          $state.complete();
        } else {
          $state.loaded();
        }
      } catch (error) {
        console.error(error);
        $state.error();
      }
    },
    handleClickMainImage({ id }) {
      const images = [...this.item.item_images];
      this.$refs.itemImageCarouselModal.open({ images, selectedId: id });
    },
    handleShowStoreList() {
      this.$refs.itemStoreListDialog.open({
        item: this.item,
      });
    },
    handleBuyFromStoreList() {
      this.onClickOpenCartDialog();
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
.tags {
  display: inline-block;
  color: $dark-pink;
  font-weight: 600;
  font-size: $size-5;
}
.tags-separator {
  display: inline-block;
  color: $middle-gray;
  font-weight: 600;
  margin-right: 3px;
}
.brand {
  font-size: $size-7;
}
.name {
  font-size: $size-5;
}
.mdce {
  font-size: $size-7;
}
.price {
  font-size: $size-5;
  .sale-price {
    color: #b23838;
  }
  .original-price {
    color: $dim-gray;
  }
}
.point {
  font-size: $size-7;
}
.columns {
  padding-left: 10px;
  &.return-wrapper {
    padding-left: 0;
    margin-top: 8px;
    .return {
      padding: 0 17px;
      line-height: 24px;
      vertical-align: middle;
      height: 24px;
      background-color: #dbdbdb;
      font-size: $size-7;
      &.unreturnable {
        color: $dark-red;
      }
    }
    .about-return {
      padding: 3px 12px 3px 0;
      margin: 0 0 0 11px;
      height: 24px;
      font-size: $size-7;
    }
  }
}
.content {
  padding: 0 10px;
}
.container {
  max-width: $desktop;
}
.cart-error {
  margin-top: 0;
  margin-bottom: 10px;
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
.item-main--wrapper {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -25px;
  > div {
    flex: 50%;
    max-width: 50%;
    padding: 0 25px;
  }
  @include touch {
    > div {
      flex: 100%;
      max-width: 100%;
    }
  }
  .item-img-slider--wrapper {
    @include touch {
      padding: 0 14px;
    }
    .sold-out {
      position: absolute;
    }
  }
}
.add-to-cart-button {
  @include desktop {
    display: none;
  }
}
.description-tabs {
  &::v-deep figure {
    margin: 0 !important;
    table {
      border: 1px double #b3b3b3;
      th {
        background-color: #f6f6f6;
      }
      th,
      td {
        border: 1px solid #bfbfbf;
      }
    }
  }
  .size-link-wrapper {
    .size-link {
      text-decoration: underline;
      position: relative;
      display: block;
      text-align: right;
      height: 24px;
      line-height: 24px;
      padding-right: 12px;
      &::before {
        content: "";
        border: solid black;
        border-width: 0 1px 1px 0;
        display: inline-block;
        padding: 3px;
        transform: rotate(-45deg);
        -webkit-transform: rotate(-45deg);
        position: absolute;
        top: 8px;
        right: 2px;
      }
    }
  }
}
.login-alert-msg {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}
</style>
