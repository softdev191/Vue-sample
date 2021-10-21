<template>
  <footer id="footer" class="page-footer" :class="{ 'pc-only': cart }">
    <div class="fixed-container">
      <div class="footer–navbar-wraper">
        <ul class="footer-navbar">
          <li
            v-for="(link, index) in links"
            :key="index"
            class="footer-navbar-item"
          >
            <NuxtLink :to="link.route" class="footer-navbar-link">
              {{ link.title }}
            </NuxtLink>
          </li>
        </ul>
      </div>
      <div class="copyright">
        {{ new Date().getFullYear() }}. YAMADAYA ALL RIGHTS RESERVED.
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  computed: {
    links() {
      return [
        { route: "/helps", title: "ご利用ガイド/ヘルプ" },
        { route: "/terms", title: "利用規約/プライバシーポリシー" },
        { route: "/contact", title: "お問い合わせ" },
        { route: "/company", title: "YAMADAYA（会社概要）" },
        { route: "/search", title: "店舗検索" },
      ];
    },
    cart() {
      const cart = this.$route.path.match(/\/cart/);
      return cart;
    },
  },
};
</script>

<style lang="scss" scoped>
.footer-navbar {
  height: 60px;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid $middle-gray;
  border-bottom: 1px solid $middle-gray;
  .footer-navbar-item {
    + .footer-navbar-item {
      margin-left: 35px;
    }
    .footer-navbar-link {
      font-size: 12px;
      color: $black;
      line-height: 1;
    }
    @include touch {
      width: 100%;
      padding: 15px 5px;
      border-bottom: solid 1px $middle-gray;
      + .footer-navbar-item {
        margin-left: 0;
      }
    }
  }
  @include touch {
    flex-wrap: wrap;
    height: auto;
    border-bottom: 0;
  }
}
.copyright {
  font-size: 10px;
  text-align: center;
  line-height: 1;
  padding: 37.5px 0 18px;
}
</style>
