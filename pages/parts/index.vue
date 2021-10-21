<template>
  <div style="position: relative">
    <div class="title is-1">is-size-1 36px</div>
    <div class="title is-2">is-size-2 30px</div>
    <div class="title is-3">is-size-3 24px</div>
    <div class="title is-4">is-size-4 18px</div>
    <div class="title is-5">is-size-5 15px</div>
    <div class="title is-6">is-size-6 12px</div>
    <div class="title is-7">is-size-7 10px</div>

    <fa :icon="faMapMarkerAlt" />
    <Checkbox id="checkboxdummy" text="あいうえお" />

    <Carousel class="mb-5" />

    <div class="container">
      <Notification />
      <BrandLogoList class="pc-only" />
      <div class="tile">
        <div class="tile">
          <article class="tile is-child sidemenu">
            <SideMenu />
          </article>
          <article class="tile is-child contents">
            <Accordion class="sp-only" />
            <TopTitle title="TEST" />
            <Goods />
            <Goods :desktop-size="5" />
            <ViewMore />
            <TopTitle title="TEST" theme="dark" />
            <Feature />
            <ViewMore theme="dark" />
            <TopTitle title="TEST" />
            <News />
          </article>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="tile">
        <div class="tile">
          <article class="tile is-child sidemenu">
            <MyPageMenu />
          </article>
          <article class="tile is-child contents">
            <MyPageMenu />
          </article>
        </div>
      </div>
    </div>
    <div class="container">
      <Breadcrumb :items="breadcrumbs" />
    </div>
    <ItemListMenu class="sp-only" />
    <InstagramAccount class="sp-only" />
    <ItemListNarrowDown class="sp-only" />
    <Logo />
    <TagList />
    <SearchBox />
    <FooterMenu class="sp-only" />
  </div>
</template>

<script>
import Carousel from "@/components/organisms/Carousel.vue";
import Notification from "@/components/organisms/Notification";
import Accordion from "@/components/organisms/Accordion";
import BrandLogoList from "@/components/organisms/BrandLogoList";
import TopTitle from "@/components/organisms/TopTitle";
import Goods from "@/components/organisms/Goods";
import ViewMore from "@/components/organisms/ViewMore";
import Feature from "@/components/organisms/Feature";
import News from "@/components/organisms/News";
import SideMenu from "@/components/organisms/SideMenu";
import MyPageMenu from "@/components/organisms/MyPageMenu";
import Breadcrumb from "@/components/organisms/Breadcrumb";
import FooterMenu from "@/components/organisms/FooterMenu";
import Logo from "@/components/organisms/Logo";
import SearchBox from "@/components/organisms/SearchBox";
import ItemListMenu from "@/components/organisms/ItemListMenu";
import InstagramAccount from "@/components/organisms/InstagramAccount";
import TagList from "@/components/organisms/TagList.vue";
import ItemListNarrowDown from "@/components/organisms/ItemListNarrowDown";

import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import Checkbox from "@/components/atoms/Checkbox.vue";

export default {
  components: {
    Carousel,
    Notification,
    Accordion,
    BrandLogoList,
    TopTitle,
    Goods,
    ViewMore,
    Feature,
    News,
    SideMenu,
    MyPageMenu,
    Breadcrumb,
    Checkbox,
    FooterMenu,
    Logo,
    SearchBox,
    ItemListMenu,
    InstagramAccount,
    TagList,
    ItemListNarrowDown,
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
          name: "商品一覧",
          url: "/items",
        },
        {
          id: 3,
          name: "商品詳細",
        },
      ],
    };
  },
  computed: {
    faMapMarkerAlt() {
      return faMapMarkerAlt;
    },
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
