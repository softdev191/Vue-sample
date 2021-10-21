<template>
  <div class="container mb-5">
    <Breadcrumb :items="breadcrumbs" />
    <div class="container">
      <div class="tile">
        <article class="tile is-child sidemenu">
          <SideMenu />
        </article>
        <article class="tile is-child contents">
          <TopTitle title="FEATURE" theme="light" />
          <DataNotFound v-if="!features.length && isReachLastPage">
            現在公開されているFEATUREはありません。
          </DataNotFound>
          <Feature :features="features" theme="light" />
          <InfiniteLoading
            v-show="!isReachLastPage"
            ref="infiniteLoading"
            @reached-end="handleReachScrollEnd"
          />
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import EventEmitter from "events";
import { mapGetters } from "vuex";
import TopTitle from "@/components/organisms/TopTitle";
import Feature from "@/components/organisms/Feature";
import SideMenu from "@/components/organisms/SideMenu";
import Breadcrumb from "@/components/organisms/Breadcrumb";
import InfiniteLoading from "@/components/molecules/InfiniteLoading";
import DataNotFound from "@/components/molecules/DataNotFound";

export default {
  components: {
    TopTitle,
    Feature,
    SideMenu,
    Breadcrumb,
    InfiniteLoading,
    DataNotFound,
  },
  props: {
    place: {
      type: String,
      default: null,
    },
    storeBrand: {
      type: Number,
      default: null,
    },
  },
  watchQuery: true,
  scrollToTop: true,
  fetchOnServer: false,
  async fetch() {
    this.$store.commit("plans/clear");
    await this.$store.dispatch("plans/fetch", this.query);
    this.events.emit("fetched");
  },
  data() {
    return {
      events: new EventEmitter(),
    };
  },
  computed: {
    ...mapGetters({
      features: "plans/data",
      isReachLastPage: "plans/isReachLastPage",
      commonStoreBrands: "master/commonStoreBrands",
      enums: "master/enums",
    }),
    query() {
      let query = {};
      if (this.place) {
        query = {
          ...query,
          place: this.place,
        };
      }
      if (this.storeBrand) {
        query = {
          ...query,
          store_brand: this.storeBrand,
        };
      }
      return query;
    },
    storeBrandObj() {
      return this.enums.common__store_brand.find(
        ({ value }) => Number(value) === this.storeBrand
      );
    },
    breadcrumbs() {
      let tmp = [
        {
          id: 1,
          name: "HOME",
          url: "/",
        },
      ];
      if (this.storeBrandObj) {
        tmp = [
          ...tmp,
          ...[
            {
              id: 2,
              name: this.storeBrandObj.label,
              url: `/${this.storeBrandObj.key.toLowerCase()}`,
            },
            {
              id: 3,
              name: `${this.storeBrandObj.label}のFeature一覧`,
            },
          ],
        ];
      } else {
        tmp.push({
          id: 2,
          name: "Feature一覧",
        });
      }
      return tmp;
    },
  },
  methods: {
    async handleReachScrollEnd($state) {
      if (this.$fetchState.pending) {
        await new Promise((resolve) => this.events.once("fetched", resolve));
        $state.loaded();
        return;
      }

      try {
        await this.$store.dispatch("plans/fetch", this.query);

        if (this.isReachLastPage) {
          $state.complete();
        } else {
          $state.loaded();
        }
      } catch (error) {
        console.error(error);
        $state.error();
      }
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
