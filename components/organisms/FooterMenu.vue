<template>
  <div v-if="!hideFooterMenu" class="wrap">
    <div class="footer-menu-stepladder" />
    <div class="footer">
      <div class="columns is-mobile is-gapless">
        <div class="column">
          <a href="#" @click.prevent="handleMenuClick">
            <MenuIconSvg class="menu-icon" />
            <p>MENU</p>
          </a>
        </div>
        <div class="column">
          <nuxt-link to="/items"
            ><SearchIconSvg class="menu-icon" />
            <p>SEARCH</p>
          </nuxt-link>
        </div>
        <div class="column">
          <nuxt-link to="/mypage/favorites"
            ><FavoriteIconSvg class="menu-icon" />
            <p>CHECK</p>
          </nuxt-link>
        </div>
        <div class="column">
          <nuxt-link to="/mypage">
            <UserIconSvg class="menu-icon" />
            <p>ACCOUNT</p>
          </nuxt-link>
        </div>
        <div class="column">
          <nuxt-link to="/cart">
            <ShopbagIconSvg class="menu-icon" />
            <p>CART</p>
          </nuxt-link>
          <div v-if="productCount > 0" class="count">{{ productCount }}</div>
        </div>
      </div>
    </div>
    <div :class="[isMenuShow ? 'menu-active' : '']" class="menu-modal--wrapper">
      <div class="menu-modal--header">
        <LogoSvg class="logo" />
        <span class="close-btn" @click="handleMenuClick">
          <CloseIconSvg />
        </span>
      </div>
      <div class="menu-modal--body">
        <div class="menu-modal--content">
          <div class="menu-main-list">
            <div v-if="isLoggedIn" class="point-info--wrapper">
              <p>
                利用できるポイント<span class="point-info">3,400ポイント</span>
              </p>
            </div>
            <div v-else class="menu-guest-btn--wrapper">
              <div>
                <nuxt-link
                  :to="{ name: 'login' }"
                  class="ymdy-btn"
                  @click.native="handleCloseMenu"
                >
                  ログイン
                </nuxt-link>
              </div>
              <div>
                <nuxt-link
                  :to="{ name: 'register' }"
                  class="ymdy-btn ymdy-btn--reserve"
                  @click.native="handleCloseMenu"
                >
                  新規登録
                </nuxt-link>
              </div>
            </div>
            <ul class="menu-list">
              <li>
                <nuxt-link
                  :to="{ name: 'mypage-favorites' }"
                  @click.native="handleCloseMenu"
                >
                  お気に入りした商品
                </nuxt-link>
              </li>
              <li v-if="isLoggedIn">
                <nuxt-link to="/" @click.native="handleCloseMenu">
                  閲覧履歴
                </nuxt-link>
              </li>
              <li>
                <a class="has-submenu" @click.prevent="handleShowStoreBrands"
                  >ストアブランドから探す</a
                >
              </li>
              <li>
                <a class="has-submenu" @click.prevent="handleShowCategories"
                  >カテゴリーから探す</a
                >
              </li>
              <li>
                <nuxt-link to="/" @click.native="handleCloseMenu">
                  新着商品
                </nuxt-link>
              </li>
              <li>
                <nuxt-link to="/" @click.native="handleCloseMenu">
                  予約商品
                </nuxt-link>
              </li>
              <li>
                <nuxt-link to="/" @click.native="handleCloseMenu">
                  セール商品
                </nuxt-link>
              </li>
              <li>
                <nuxt-link
                  :to="{ name: 'styling' }"
                  @click.native="handleCloseMenu"
                >
                  スタイリング
                </nuxt-link>
              </li>
              <li>
                <nuxt-link
                  :to="{ name: 'feature' }"
                  @click.native="handleCloseMenu"
                >
                  特集
                </nuxt-link>
              </li>
              <li>
                <nuxt-link
                  :to="{ name: 'news' }"
                  @click.native="handleCloseMenu"
                >
                  NEWS
                </nuxt-link>
              </li>
              <li>
                <nuxt-link to="/" @click.native="handleCloseMenu">
                  店舗検索
                </nuxt-link>
              </li>
              <li>
                <nuxt-link to="/" @click.native="handleCloseMenu">
                  サイズガイド
                </nuxt-link>
              </li>
              <li>
                <nuxt-link to="/helps" @click.native="handleCloseMenu">
                  ご利用ガイド/ヘルプ
                </nuxt-link>
              </li>
              <li>
                <nuxt-link
                  :to="{ name: 'contact' }"
                  @click.native="handleCloseMenu"
                >
                  お問い合わせ
                </nuxt-link>
              </li>
            </ul>
          </div>
          <div
            :class="[isStoreBrandsShow ? 'store-brand-list--active' : '']"
            class="submenu--wrapper"
          >
            <ul class="menu-list store-brand-list">
              <li>
                <a
                  class="menu-back-btn"
                  @click.prevent="handleShowStoreBrands"
                ></a>
              </li>
              <li
                v-for="storeBrand in commonStoreBrands"
                :key="storeBrand.key"
                @click.prevent="handleMenuClick"
              >
                <nuxt-link
                  :to="{
                    name: 'brands-brand',
                    params: { brand: storeBrand.key.toLowerCase() },
                  }"
                >
                  {{ storeBrand.label }}
                </nuxt-link>
              </li>
            </ul>
          </div>
          <div
            :class="[isCategoriesShow ? 'category-list--active' : '']"
            class="submenu--wrapper"
          >
            <ul class="menu-list category-list">
              <li>
                <a
                  class="menu-back-btn"
                  @click.prevent="handleShowCategories"
                ></a>
              </li>
              <sp-menu-accordion-2
                v-for="cate in onlineCategoryTree"
                :id="cate.id"
                :key="cate.id"
                :name="cate.name"
                :children="cate.children"
                @closeMenu="handleCloseMenu"
              />
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import LogoSvg from "@/assets/images/logos/logo-black.svg";
import MenuIconSvg from "@/assets/images/icons/menu-icon.svg";
import SearchIconSvg from "@/assets/images/icons/search-icon.svg";
import FavoriteIconSvg from "@/assets/images/icons/favorite-icon.svg";
import UserIconSvg from "@/assets/images/icons/user-icon.svg";
import ShopbagIconSvg from "@/assets/images/icons/shopbag-icon.svg";
import CloseIconSvg from "@/assets/images/icons/close-icon.svg";
import SpMenuAccordion2 from "../molecules/SpMenuAccordion2";

export default {
  name: "FooterMenu",
  components: {
    SpMenuAccordion2,
    LogoSvg,
    MenuIconSvg,
    SearchIconSvg,
    FavoriteIconSvg,
    UserIconSvg,
    ShopbagIconSvg,
    CloseIconSvg,
  },
  data() {
    return {
      isMenuShow: false,
      isStoreBrandsShow: false,
      isCategoriesShow: false,
      slickOptions: {
        slidesToShow: 1,
        infinite: true,
        accessibility: true,
        arrows: true,
        dots: true,
        draggable: true,
        edgeFriction: 0.3,
        swipe: true,
      },
      hideFooterMenuPath: ["/cart/order"],
    };
  },
  computed: {
    ...mapState({
      productCount(state, getters) {
        return getters["cart/productCount"];
      },
    }),
    ...mapGetters({
      commonStoreBrands: "master/commonStoreBrands",
      onlineCategories: "master/onlineCategories",
      onlineCategoryTree: "master/onlineCategoryTree",
    }),
    isLoggedIn() {
      return this.$auth.loggedIn;
    },
    hideFooterMenu() {
      for (const path of this.hideFooterMenuPath) {
        if (this.$route.path.includes(path)) {
          return true;
        }
      }
      return false;
    },
  },
  methods: {
    handleMenuClick() {
      this.isMenuShow = !this.isMenuShow;
    },
    handleShowStoreBrands() {
      this.isStoreBrandsShow = !this.isStoreBrandsShow;
    },
    handleShowCategories() {
      this.isCategoriesShow = !this.isCategoriesShow;
    },
    handleCloseMenu() {
      this.isMenuShow = false;
      this.isCategoriesShow = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.footer-menu-stepladder {
  height: 90px;
  width: 100%;
}
.footer {
  position: fixed;
  z-index: 1000;
  bottom: 0;
  left: 0;
  padding: 20px 0 !important;
  width: 100%;
  border-top: solid 1px #a7a7a7;
  .column {
    text-align: center;
    flex: none;
    width: 20%;

    a {
      display: block;
      width: 100%;
      font-size: 8px;
      color: #000;
      svg {
        margin-bottom: 5px;
        width: 20px;
      }
    }

    .count {
      display: block;
      position: absolute;
      top: 8px;
      right: calc(10% - 17px);
      color: #fff;
      font-size: 8px;
      width: 18px;
      height: 18px;
      text-align: center;
      padding: 1px;
      border: 1px solid #000;
      background-color: #000;
      border-radius: 50%;
      z-index: 1;
    }
  }
}
.menu-modal--wrapper {
  position: fixed;
  bottom: 80px;
  left: 0;
  width: 100%;
  background-color: #fff;
  overflow: auto;
  z-index: 10;
  transition: height 0.7s;
  top: auto;
  height: 0;

  .menu-modal--header {
    position: relative;
    height: 50px;
    text-align: center;
    padding: 13px 0;
    border-bottom: 1px solid #a7a7a7;
    .logo {
      height: 25px;
    }
    .close-btn {
      position: absolute;
      display: inline-block;
      right: 10px;
      top: calc(50% - 5.5px);
      font-size: 0;
    }
  }
  .menu-modal--body {
    height: calc(100vh - 130px);
    overflow: auto;
  }
  .point-info--wrapper {
    font-size: 10px;
    text-align: center;
    padding: 20px 0;
    border-bottom: 1px solid #dbdbdb;
    .point-info {
      font-size: 16px;
      font-weight: bold;
      margin-left: 5px;
    }
  }
  .menu-list {
    width: 100%;
    padding: 0 5px;
    > li {
      a {
        display: block;
        width: 100%;
        font-size: 14px;
        padding: 15px 5px;
        border-bottom: 1px solid #dbdbdb;
        &.has-submenu {
          background: url(../../assets/images/link-caret.png) no-repeat center
            right 5px;
        }
        &.menu-back-btn {
          height: 48px;
          background: url(../../assets/images/link-caret-left.png) no-repeat
            center left 5px;
        }
      }
    }
  }
  .menu-modal--content {
    position: relative;
    height: 100%;
    overflow: hidden;
  }
}
.menu-modal--wrapper.menu-active {
  height: calc(100% - 80px);
}
.menu-main-list,
.submenu--wrapper {
  position: absolute;
  top: 0;
  left: 100%;
  width: 100%;
  height: 100%;
  background-color: #fff;
  overflow: auto;
  transition: all 0.7s;
  &.store-brand-list--active,
  &.category-list--active {
    left: 0;
  }
}
.menu-main-list {
  left: 0;
}
.category-list {
  .has-children {
    position: relative;
    font-weight: bold;
    &::after {
      content: "";
      position: absolute;
      top: calc(50% - 3.5px);
      right: 5px;
      display: inline-block;
      width: 13px;
      height: 7px;
      background: url(../../assets/images/link-caret-down.png) no-repeat;
    }
  }
}
.menu-guest-btn--wrapper {
  display: flex;
  padding: 10px 20px;
  margin: 0 -3px;
  > div {
    flex: 50%;
    max-width: 50%;
    padding: 0 3px;
  }
}
</style>
