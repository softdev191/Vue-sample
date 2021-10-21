<template>
  <header>
    <div class="columns is-mobile is-gapless">
      <div class="column left pc-only">
        <a>
          <MenuIconSvg class="menu-icon" />
        </a>
        <nuxt-link to="/items">
          <SearchIconSvg class="menu-icon" />
        </nuxt-link>
      </div>
      <div class="column left sp-only">
        <div
          v-show="showBack"
          class="header-icon sp-only header-back-button"
          @click="back"
        >
          <fa :icon="faChevronLeft" />
        </div>
      </div>
      <div class="column has-text-centered">
        <nuxt-link to="/">
          <LogoSvg />
        </nuxt-link>
      </div>
      <div class="column right pc-only">
        <nuxt-link to="/mypage/favorites">
          <FavoriteIconSvg class="menu-icon" />
        </nuxt-link>
        <nuxt-link to="/mypage">
          <UserIconSvg class="menu-icon" />
        </nuxt-link>
        <nuxt-link to="/cart">
          <ShopbagIconSvg class="menu-icon" />
          <div v-show="productCount > 0" class="count">
            {{ productCount || 0 }}
          </div>
        </nuxt-link>
      </div>
      <div class="column left sp-only"></div>
    </div>
  </header>
</template>

<script>
import { mapState } from "vuex";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import LogoSvg from "@/assets/images/logos/logo-black.svg";
import MenuIconSvg from "@/assets/images/icons/menu-icon.svg";
import SearchIconSvg from "@/assets/images/icons/search-icon.svg";
import FavoriteIconSvg from "@/assets/images/icons/favorite-icon.svg";
import UserIconSvg from "@/assets/images/icons/user-icon.svg";
import ShopbagIconSvg from "@/assets/images/icons/shopbag-icon.svg";

export default {
  components: {
    LogoSvg,
    MenuIconSvg,
    SearchIconSvg,
    FavoriteIconSvg,
    UserIconSvg,
    ShopbagIconSvg,
  },
  data() {
    return {
      showBackBtnPaths: [
        "/mypage",
        "/register",
        "/login",
        "/transfer/forget/email",
        "/transfer/forget/both",
      ],
      hideBackBtnPathsExact: ["/mypage", "/register/members/activate/complete"],
    };
  },
  computed: {
    ...mapState({
      productCount(state, getters) {
        return getters["cart/productCount"];
      },
    }),
    faChevronLeft() {
      return faChevronLeft;
    },
    showBack() {
      for (const path of this.showBackBtnPaths) {
        if (
          this.$route.path.includes(path) &&
          !this.hideBackBtnPathsExact.includes(this.$route.path)
        ) {
          return true;
        }
      }
      return false;
    },
  },
  methods: {
    menu() {},
    search() {},
    heart() {},
    account() {},
    cart() {},
    back() {
      this.$router.back();
    },
    close() {},
  },
};
</script>

<style lang="scss" scoped>
header {
  border-bottom: 1px solid #a7a7a7;
  .columns {
    height: 90px;
    margin: 0 auto !important;
    align-items: center;
    max-width: $desktop;
    @include touch {
      height: 50px;
    }
  }

  .column {
    &.left {
      .menu-icon {
        height: 20px;
        width: auto;
        margin-right: 30px;
        margin-left: 5px;
      }
    }
    &.right {
      text-align: right;
      padding-right: 20px;
      .menu-icon {
        height: 20px;
        width: auto;
        margin-right: 18px;
        &:last-child {
          margin-right: 30px;
        }
      }
      .count {
        display: block;
        position: absolute;
        top: -15px;
        right: 3px;
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
        line-height: 13px;
      }
    }
    a {
      position: relative;
    }
  }

  .has-text-centered {
    svg {
      @include touch {
        height: 25px;
      }
    }
  }

  .header-back-button {
    margin-left: 15px;
    cursor: pointer;
  }
}
</style>
