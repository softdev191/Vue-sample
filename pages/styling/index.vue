<template>
  <div>
    <div class="container mb-5">
      <Breadcrumb :items="breadcrumbs" />
    </div>
    <StylingMenu class="sp-only" />
    <div class="container">
      <div class="tile">
        <article class="tile is-child sidemenu">
          <SideMenu />
        </article>
        <article class="tile is-child contents">
          <Stylings />
          <Stylings :desktop-size="5" />
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import StylingMenu from "@/components/organisms/StylingMenu";
import SideMenu from "@/components/organisms/SideMenu";
import Breadcrumb from "@/components/organisms/Breadcrumb";
import Stylings from "@/components/organisms/Stylings";
export default {
  components: {
    StylingMenu,
    SideMenu,
    Breadcrumb,
    Stylings,
  },
  data() {
    return {
      breadcrumbs: [
        {
          id: 1,
          name: "HOME",
          url: "/",
        },
        {
          id: 2,
          name: "スタイリング",
        },
      ],
    };
  },
  head() {
    return {
      title: "スタイリング一覧｜YAMADAYA onlinestore",
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "YAMADAYA onlinestoreのスタイリング一覧はこちら。YAMADAYA公式オンライン通販サイトでは、オリジナルブランドから人気のセレクトブランドまで多数取り揃えております。",
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
</style>
