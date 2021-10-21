<template>
  <div class="container">
    <Breadcrumb :items="breadcrumbs" />
    <SearchBox :placeholder="placeholder" @search="search" />
    <div class="mb100">
      <div v-if="!isPageLoading" class="result-area">
        <div v-if="helps.length > 0">
          <h2 class="ml10 mb30 fs14">{{ helps.length }}件 見つかりました</h2>
          <div class="mini-divider" />
          <ul v-if="helps" class="menu-list fs14">
            <li v-for="(help, index) in helps" :key="index">
              <NuxtLink :to="`/helps/${help.id}`">
                {{ help.title }}
              </NuxtLink>
            </li>
          </ul>
        </div>
        <DataNotFound v-else>
          該当するヘルプは見つかりませんでした。
        </DataNotFound>
      </div>
      <InfiniteLoading v-else ref="infiniteLoading" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/organisms/Breadcrumb";
import SearchBox from "@/components/organisms/SearchBox";
import InfiniteLoading from "@/components/molecules/InfiniteLoading";
import DataNotFound from "@/components/molecules/DataNotFound";
export default {
  components: {
    Breadcrumb,
    SearchBox,
    InfiniteLoading,
    DataNotFound,
  },
  async fetch() {
    const { q } = this.$route.query;
    await this.search(q);
  },
  data() {
    return {
      searchHit: true,
      isPageLoading: false,
      count: 2,
      placeholder: "お問い合わせを検索",
      breadcrumbs: [
        {
          id: 1,
          name: "HOME",
          url: "/",
        },
        {
          id: 2,
          name: "ヘルプ一覧",
          url: "/help",
        },
        {
          id: 3,
          name: "検索結果",
        },
      ],
      results: [
        {
          index: 1,
          param: "",
          content: "アカウントの情報が変更できない",
        },
        {
          index: 2,
          param: "",
          content: "パスワードの変更ができない",
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      helps: "helps/data",
    }),
  },
  watch: {
    "$route.query": "$fetch",
  },
  methods: {
    async search(param) {
      this.isPageLoading = true;
      await this.$store.dispatch("helps/fetch", {
        // is_faq: よくある質問に表示（DB定義）
        is_faq: 1,
        q: param,
      });
      this.isPageLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  max-width: $desktop;
  .menu-list li {
    a {
      padding: 15px 5px;
      margin: 0 5px 0 5px;
      position: relative;
      border-bottom: solid 1px $middle-gray;
    }
  }
}
</style>
