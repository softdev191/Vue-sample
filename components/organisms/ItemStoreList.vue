<template>
  <div class="s-wrapper">
    <div class="s-header columns">
      <div class="is-5 column search-location-btn-wrapper">
        <Button class="search-location-btn" @click="handleSortByNearest"
          >位置情報から近い情報を取得する</Button
        >
      </div>
      <ItemSearchBox
        v-model="inputKeyword"
        class="s-search-box is-7 column"
        placeholder="店舗名または住所を入力"
        @search="handleKeywordSearch"
      />
    </div>
    <div class="s-itme-summary">
      <ItemStockNote />
      <ItemStockSummary :item="item" class="item-stock-summary" />
    </div>
    <div class="s-list sp">
      <ItemStoreItem
        v-for="(store, index) in stores"
        :key="index"
        :item="item"
        :store="store"
        @buy="$emit('buy')"
      />
    </div>
    <div class="s-list pc">
      <ItemStoreItemPc
        v-for="(store, index) in stores"
        :key="index"
        :item="item"
        :store="store"
      />
    </div>
    <InfiniteLoading
      v-show="!isReachLastPage"
      ref="infiniteLoading"
      @reached-end="handleReachScrollEnd"
    />
  </div>
</template>

<script>
import EventEmitter from "events";
import { mapGetters } from "vuex";
import Button from "@/components/atoms/Button";
import ItemSearchBox from "@/components/organisms/ItemSearchBox";
import ItemStoreItem from "@/components/molecules/ItemStoreItem";
import ItemStoreItemPc from "@/components/molecules/ItemStoreItemPc";
import InfiniteLoading from "@/components/molecules/InfiniteLoading";
import ItemStockNote from "@/components/molecules/ItemStockNote";
import ItemStockSummary from "@/components/molecules/ItemStockSummary";

export default {
  name: "ItemStoreList",
  emmits: ["buy"],
  components: {
    Button,
    ItemSearchBox,
    ItemStoreItem,
    ItemStoreItemPc,
    InfiniteLoading,
    ItemStockNote,
    ItemStockSummary,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      inputKeyword: "",
      firstFetched: false,
      events: new EventEmitter(),
      currentFetchConditions: {},
    };
  },
  computed: {
    ...mapGetters({
      stores: "itemStore/data",
      cursor: "itemStore/cursor",
    }),
    isReachLastPage() {
      return this.cursor.isReachedEnd;
    },
  },
  async created() {
    await this.fetchFirstCursor();
  },
  beforeDestroy() {
    this.$store.commit("itemStore/clear");
  },
  methods: {
    async handleReachScrollEnd($state) {
      if (!this.firstFetched) {
        await new Promise((resolve) => this.events.once("fetched", resolve));
        $state.loaded();
        return;
      }

      try {
        await this.$store.dispatch("itemStore/nextPage", {
          itemId: this.item.id,
          params: this.currentFetchConditions,
        });

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

    async handleKeywordSearch(q) {
      try {
        this.$nuxt.$loading.start();
        await this.fetchFirstCursor(q ? { q } : {});
      } catch (error) {
        console.error(error);
      } finally {
        this.$nuxt.$loading.finish();
      }
    },

    async handleSortByNearest() {
      try {
        this.$nuxt.$loading.start();

        this.$store.commit("itemStore/clear");
        this.firstFetched = false;
        this.$refs.infiniteLoading.resetLoadingState();

        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;

        await this.fetchFirstCursor({
          near_loc_lon: longitude,
          near_loc_lat: latitude,
        });
      } catch (error) {
        if (error instanceof window.GeolocationPositionError) {
          switch (error.code) {
            case window.GeolocationPositionError.POSITION_UNAVAILABLE:
              // 位置情報の取得に失敗
              // 何かしらのインタラクションを必要に応じて出す。
              console.error(error);
              break;
            case window.GeolocationPositionError.PERMISSION_DENIED:
            case window.GeolocationPositionError.TIMEOUT:
            default:
              // ユーザー拒否・タイムアウト
              console.log(error);
              return;
          }
        }

        console.error(error);
      } finally {
        this.$nuxt.$loading.finish();
      }
    },

    async fetchFirstCursor(params = {}) {
      try {
        this.firstFetched = false;

        this.$store.commit("itemStore/clear");

        params.has_stock = 1;

        await this.$store.dispatch("itemStore/fetchCursor", {
          itemId: this.item.id,
          params,
        });

        this.currentFetchConditions = { ...params };
        this.events.emit("fetched");
        this.$refs.infiniteLoading.resetLoadingState();

        // eslint-disable-next-line no-useless-catch
      } catch (error) {
        throw error;
      } finally {
        this.firstFetched = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.search-location-btn {
  margin-bottom: 26px;
  margin-top: 26px;
  &::v-deep {
    .button {
      width: 78%;
    }
  }
  @include desktop {
    text-align: left;
  }
}
.search-location-btn-wrapper.column {
  padding: 0;
}
.s-search-box.column {
  margin: 0 16px 28px;
  padding: 0;

  @include desktop {
    margin: 26px 0 28px 0;
  }
}
.s-itme-summary {
  display: none;

  @include desktop {
    display: block;

    .item-stock-summary {
      margin-top: 4px;
      margin-bottom: 5px;
    }
  }
}
.s-list {
  @include desktop {
    padding-bottom: 54px;
  }
}
.sp {
  @include desktop {
    display: none;
  }
}
.pc {
  @include touch {
    display: none;
  }
}
</style>
