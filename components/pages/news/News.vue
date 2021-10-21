<template>
  <div>
    <div class="container">
      <Breadcrumb :items="breadcrumbs" />
      <div class="tile">
        <article class="tile is-child sidemenu">
          <SideMenu />
        </article>
        <article class="tile is-child contents">
          <TopTitle title="NEWS" />
          <DataNotFound v-if="!news.length && isReachLastPage">
            現在公開されているNEWSはありません。
          </DataNotFound>
          <News :news="news" />
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
import News from "@/components/organisms/News";
import SideMenu from "@/components/organisms/SideMenu";
import Breadcrumb from "@/components/organisms/Breadcrumb";
import InfiniteLoading from "@/components/molecules/InfiniteLoading";
import DataNotFound from "@/components/molecules/DataNotFound";

export default {
  components: {
    TopTitle,
    News,
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
      news: "plans/data",
      isReachLastPage: "plans/isReachLastPage",
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
              name: `${this.storeBrandObj.label}のNews一覧`,
            },
          ],
        ];
      } else {
        tmp.push({
          id: 2,
          name: "News一覧",
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
  .instagram {
    margin-bottom: 22.5px;
  }
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
