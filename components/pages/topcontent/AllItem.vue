<template>
  <div class="container mb-5">
    <Breadcrumb :items="breadcrumbs" />
    <div class="tile">
      <article class="tile is-child sidemenu">
        <SideMenu />
      </article>
      <article class="tile is-child contents">
        <TopTitle :title="pageTitle" theme="light" />
        <Goods :items="items" />
      </article>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TopTitle from "@/components/organisms/TopTitle";
import Goods from "@/components/organisms/Goods";
import SideMenu from "@/components/organisms/SideMenu";
import Breadcrumb from "@/components/organisms/Breadcrumb";

export default {
  components: {
    TopTitle,
    Goods,
    SideMenu,
    Breadcrumb,
  },
  props: {
    storeBrandIndex: {
      type: String,
      default: null,
    },
  },
  async fetch() {
    this.$store.commit("item/clear");
    await this.$store.dispatch("item/fetch", {
      main_store_brand: [this.storeBrandIndex],
    });
  },
  computed: {
    ...mapGetters({
      items: "item/data",
      enums: "master/enums",
    }),
    breadcrumbs() {
      const items = [
        {
          id: 1,
          name: "HOME",
          url: "/",
        },
      ];
      if (this.storeBrandIndex) {
        items.push({
          id: 2,
          name: this.storeBrand.label,
          url: `/${this.storeBrand.key.toLowerCase()}`,
        });
      }

      items.push({
        id: items.length + 1,
        name: "ALL ITEM",
      });

      return items;
    },
    pageTitle() {
      return `ALL ITEM (${this.storeBrand.label})`;
    },
    storeBrand() {
      return this.enums.common__store_brand.find(
        ({ value }) => value === this.storeBrandIndex
      );
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
