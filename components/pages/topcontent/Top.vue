<template>
  <div>
    <Carousel class="mb-5" v-if="!$fetchState.pending" />

    <div class="container">
      <div class="tile">
        <article class="tile is-child sidemenu">
          <SideMenu />
        </article>
        <article class="tile is-child contents">
          <Notification class="mb-5" />
          <TopTitle title="STORE BRAND" class="pc-only" />
          <BrandLogoList class="pc-only" />
          <Accordion class="sp-only" />
          <TopTitle title="NEW ITEM" />
          <Goods
            :items="newItems"
            :desktop-size="4"
            @toggleFavorite="(item) => handleToggleFavorite(item, NEW_ITEMS)"
          />
          <ViewMore
            :link="{
              name: 'items',
              query: { ...storeBrandQuery },
            }"
          />

          <TopTitle title="PICK UP" />
          <Goods
            :items="pickups"
            :desktop-size="4"
            @toggleFavorite="(item) => handleToggleFavorite(item, PICKUPS)"
          />
          <ViewMore
            :link="{
              name: 'items',
              query: {
                ...storeBrandQuery,
                sort: 'recommend-asc',
              },
            }"
          />

          <TopTitle title="FEATURE" :background="backgroundColor" />
          <Feature :features="features" :background="backgroundColor" />
          <ViewMore
            :link="{ path: `${storeBrandPrefix}feature` }"
            :background="backgroundColor"
            gap="less"
            theme="dark"
          />

          <TopTitle title="STYLING" />
          <Stylings />
          <ViewMore :link="{ path: 'styling' }" />

          <TopTitle title="NEWS" />
          <News :news="news" />
          <ViewMore :link="{ path: `${storeBrandPrefix}news` }" />

          <TopTitle title="BRAND" theme="gray" />
          <BrandLogoList :size="5" theme="dark" :footer="true" />
        </article>
      </div>
    </div>
    <InstagramAccount
      v-if="storeBrandPrefix != '' && instagramAccount != ''"
      class="sp-only instagram"
      :account="instagramAccount"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Carousel from "@/components/organisms/Carousel.vue";
import Notification from "@/components/organisms/Notification";
import Accordion from "@/components/organisms/Accordion";
import BrandLogoList from "@/components/organisms/BrandLogoList";
import TopTitle from "@/components/organisms/TopTitle";
import Goods from "@/components/organisms/Goods";
import ViewMore from "@/components/organisms/ViewMore";
import Feature from "@/components/organisms/Feature";
import Stylings from "@/components/organisms/Stylings";
import News from "@/components/organisms/News";
import SideMenu from "@/components/organisms/SideMenu";
import InstagramAccount from "@/components/organisms/InstagramAccount";
import { NEW_ITEMS } from "@/constants";
import { PICKUPS } from "@/constants";

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
    Stylings,
    InstagramAccount,
  },
  props: {
    storeBrandIndex: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      NEW_ITEMS,
      PICKUPS,
    };
  },
  async fetch() {
    await Promise.all([
      this.$store.dispatch("top/fetchByStoreBrand", {
        store_brand: this.storeBrandIndex,
        useCache: true,
      }),
      this.$store.dispatch("information/fetchTop"),
    ]);
  },
  computed: {
    ...mapGetters({
      newItems: "top/newItems",
      pickups: "top/pickups",
      features: "top/features",
      news: "top/news",
      backgroundColor: "top/background_color",
      enums: "master/enums",
      instaAccounts: "master/instagramAccounts",
    }),
    storeBrand() {
      return this.enums.common__store_brand.find(
        ({ value }) => Number(value) === this.storeBrandIndex
      );
    },
    storeBrandPrefix() {
      return this.storeBrandIndex
        ? `/brands/${this.storeBrand.key.toLowerCase()}/`
        : "";
    },
    storeBrandQuery() {
      if (!this.storeBrandIndex) return {};
      return {
        main_store_brand: this.storeBrandIndex,
      };
    },
    instagramAccount() {
      return this.storeBrandIndex
        ? this.instaAccounts?.find(
            (item) => Number(item.key) === this.storeBrandIndex
          ).value
        : "";
    },
  },
  methods: {
    handleToggleFavorite(item, type) {
      if (!this.$auth.loggedIn) {
        this.$refs.loginAlertDialog.show();
        return;
      }

      this.$store.dispatch("top/updateFavorite", {
        id: item.id,
        itemType: type,
        isFavorite: !Number(item.is_favorite),
      });
    },
    handleGoLogin() {
      this.$store.commit("route/setRedirectPath", this.$route.fullPath);
      this.$router.push({ name: "login" });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  max-width: $desktop;
}
.instagram {
  margin-top: 100px;
}
.sidemenu {
  @include touch {
    display: none;
  }
  @include desktop {
    flex: none;
    width: 230px;
    padding-right: 50px;
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
.login-alert-msg {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}
</style>
