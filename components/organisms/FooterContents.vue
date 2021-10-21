<template>
  <div>
    <aside class="menu">
      <ul class="menu-list is-size-6">
        <li v-for="(link, index) in links" :key="index">
          <nuxt-link :to="link.route"> {{ link.title }}</nuxt-link>
        </li>
      </ul>
    </aside>
    <p>2020. YAMADAYA ALL RIGHTS RESERVED.</p>
  </div>
</template>

<script>
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

export default {
  components: {},
  data() {
    return {
      showFilter: true,
      showBrand: false,
      showCategory: false,
      isGuest: false,
      links: [
        { route: "/helps", title: "ご利用ガイド/ヘルプ" },
        { route: "/privacy", title: "プライバシーポリシー" },
        { route: "/terms", title: "利用規約" },
        { route: "/contact", title: "お問い合わせ" },
        { route: "/company", title: "YAMADAYA（会社概要）" },
        { route: "/search", title: "店舗検索" },
      ],
    };
  },
  computed: {
    faQuestionCircle() {
      return faQuestionCircle;
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.menu {
  padding-top: 60px;
}
.menu-label {
  border-bottom: solid 1px #a7a7a7;
  padding: 10px 5px;
  color: #4a4a4a;
  margin: 10px 5px 0 5px;
  font-weight: 600;
}
.menu-list {
  @include touch {
    display: block;
  }
  @include desktop {
    border-top: solid 1px $middle-gray;
    border-bottom: solid 1px $middle-gray;
    display: flex;
    padding-top: 25px;
    padding-bottom: 19px;
    margin-left: 10%;
    margin-right: 10%;
    justify-content: center;
  }
}
.menu-list li {
  a {
    @include touch {
      border-top: solid 1px $middle-gray;
      padding: 15px 5px;
      margin: 0 5px 0 5px;
      position: relative;
    }
  }

  &:last-child > a {
    @include touch {
      border-bottom: solid 1px $middle-gray;
    }
  }
}

p {
  margin: 50px 0 10px;
  text-align: center;
}
</style>
