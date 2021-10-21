<template>
  <div class="fixed-container">
    <Breadcrumb text="HOME > マイページ > お気に入りした商品" />
    <div v-if="authCheck" class="mypage-layout">
      <SideMenu />
      <div class="mypage-main">
        <PageTitle>お気に入りした商品</PageTitle>
        <template v-if="items && items.length">
          <Goods
            class="search-goods"
            :items="favoriteItems"
            :image-dispaly-mode="imageDispalyMode"
            @toggleFavorite="handleToggleFavorite"
          />
          <InfiniteLoading
            v-show="!isReachLastPage"
            ref="infiniteLoading"
            @reached-end="handleReachScrollEnd"
          />
        </template>
        <DataNotFound v-else>現在お気に入り商品はありません。</DataNotFound>
      </div>
    </div>
    <div v-else class="mypage-layout">
      <div class="mypage-main">
        <PageTitle>お気に入りした商品</PageTitle>
        <p class="message">
          お気に入り機能は、ログインするとご利用いただけます。<br />
          ※♡マークにタップした商品だけを、一覧で見れるようになります。
        </p>
        <div class="button-row">
          <ButtonLink to="/login" theme="light" class="mr-3"
            >ログイン</ButtonLink
          >
          <ButtonLink to="/register" theme="dark">新規会員登録</ButtonLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from "@/components/atoms/PageTitle";
import Breadcrumb from "@/components/partials/Breadcrumb";
import SideMenu from "@/components/pages/mypage/SideMenu";
import ButtonLink from "@/components/atoms/ButtonLink";
import Goods from "@/components/organisms/Goods";
import InfiniteLoading from "@/components/molecules/InfiniteLoading";
import DataNotFound from "@/components/molecules/DataNotFound";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default {
  components: {
    PageTitle,
    Breadcrumb,
    SideMenu,
    ButtonLink,
    Goods,
    InfiniteLoading,
    DataNotFound,
  },
  async asyncData({ $api, $auth }) {
    if (!$auth.user) {
      return;
    }
    const { data, meta } = await $api.fetch(
      `member/${$auth.user.id}/favorites`
    );
    return {
      items: data,
      pagination: meta,
      loading: false,
      authCheck: true,
    };
  },
  data() {
    return {
      loading: false,
      imageDispalyMode: false,
      authCheck: false,
    };
  },
  computed: {
    faChevronRight() {
      return faChevronRight;
    },
    isReachLastPage() {
      return this.pagination.current_page >= this.pagination.last_page;
    },
    favoriteItems() {
      return this.items.filter((item) => item.is_favorite);
    },
  },
  methods: {
    async handleReachScrollEnd($state) {
      if (this.loading) {
        $state.loaded();
        return;
      }

      try {
        this.loading = true;
        const { data, meta } = await this.$api.fetch(
          `member/${this.$auth.user.id}/favorites`,
          {
            params: {
              page: this.pagination.current_page + 1,
            },
          }
        );

        this.items = [...this.items, ...data];
        this.pagination = meta;

        if (this.isReachLastPage) {
          $state.complete();
        } else {
          $state.loaded();
        }
      } catch (error) {
        console.error(error);
        $state.error();
      } finally {
        this.loading = false;
      }
    },
    async handleToggleFavorite(item) {
      this.loading = true;

      item.is_favorite = !Number(item.is_favorite);

      await this.$store.dispatch("item/updateFavorite", {
        id: item.id,
        isFavorite: item.is_favorite,
      });

      const { data, meta } = await this.$api.fetch(
        `member/${this.$auth.user.id}/favorites`
      );

      this.items = data;
      this.pagination = meta;
      this.loading = false;
    },
  },
  head() {
    return {
      title: "お気に入りした商品",
    };
  },
};
</script>

<style lang="scss" scoped>
.product-list-wrapper {
  > .product-list {
    display: flex;
    flex-wrap: wrap;
    > .product-list-item {
      width: calc(50% - 3px);
      &:nth-child(2n + 1) {
        margin-right: 6px;
      }
    }
  }
}
.message {
  font-size: 12px;
  line-height: 22px;
  background-color: $white;
}
.button-row {
  display: flex;
  justify-content: space-between;
  .btn {
    width: 49%;
  }
}
</style>
