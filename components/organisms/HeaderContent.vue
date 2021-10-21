<template>
  <header class="columns is-mobile is-gapless">
    <div class="column left">
      <a> <img class="menu-icon" src="@/assets/images/menu-icon.png" /></a>
      <nuxt-link to="/items">
        <img class="menu-icon" src="@/assets/images/search-icon.png" />
      </nuxt-link>
    </div>
    <div class="column has-text-centered">
      <nuxt-link to="/"><img src="@/assets/images/logo.png" /></nuxt-link>
    </div>
    <div class="column right">
      <nuxt-link to="/mypage/favorites"
        ><img class="menu-icon" src="@/assets/images/check-icon.png"
      /></nuxt-link>
      <nuxt-link to="/mypage"
        ><img class="menu-icon" src="@/assets/images/account-icon.png"
      /></nuxt-link>
      <nuxt-link to="/cart">
        <img class="menu-icon" src="@/assets/images/cart-icon.png" />
        <div v-if="productCount > 0" class="count">
          {{ productCount }}
        </div></nuxt-link
      >
    </div>
  </header>
</template>

<script>
import { mapState } from "vuex";
export default {
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapState({
      productCount(state, getters) {
        return getters["cart/productCount"];
      },
    }),
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
header.columns {
  height: 90px;
  margin: 0 !important;
  align-items: center;

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
        top: 25px;
        right: 5px;
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
}
</style>
