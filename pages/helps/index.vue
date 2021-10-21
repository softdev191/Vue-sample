<template>
  <div class="container">
    <Breadcrumb :items="breadcrumbs" />
    <SearchBox :placeholder="placeholder" />
    <ListTitle>お知らせ</ListTitle>
    <div v-if="notices" class="mr10 ml10 mb50">
      <NuxtLink
        v-for="(notice, index) in notices"
        :key="index"
        :to="`/information/${notice.id}`"
        class="notice-link"
      >
        <div class="fs10 mt15 mb10">
          {{ notice.publish_at | dateTime }}
        </div>
        <div class="fs12 mb15">{{ notice.title }}</div>
        <div class="mini-divider mb15" />
      </NuxtLink>
    </div>
    <ListTitle>よくあるお問い合わせ</ListTitle>
    <div class="mb50">
      <ul class="menu-list">
        <li v-for="(faq, index) in helps" :key="index" class="fs14">
          <a :href="`/helps/${faq.id}`">
            {{ faq.title }}
          </a>
        </li>
      </ul>
    </div>
    <ListTitle>カテゴリから探す</ListTitle>
    <div v-if="helpCategories" class="mb50">
      <ul
        v-for="(category, index) in helpCategories"
        :key="index"
        class="menu-list is-size-6"
      >
        <li class="fs14">
          <a :href="'/helps/category?param=' + category.id">
            {{ category.name }}
          </a>
        </li>
      </ul>
    </div>
    <ListTitle class="mb20">直接お問い合わせ</ListTitle>
    <div class="ml10 mr10 mb100">
      <div class="form-group mb15">
        <div class="columns is-mobile is-centered is-gapless">
          <ButtonWrapper theme="full">
            <Button theme="light" @click="contactOnChat">
              チャットでお問い合わせする
            </Button>
          </ButtonWrapper>
        </div>
      </div>
      <div class="mb30">対応時間: 10:00〜18:00（日・祝を除く)</div>
      <div class="contact-email mb15">
        <span class="has-text-weight-bold">
          お問い合わせは
          <nuxt-link :to="{ name: 'contact' }">こちら</nuxt-link>から</span
        >
      </div>
      <div class="mb10">対応時間 : 10:00〜18:00</div>
      <div class="is-size-7">
        メールでお問い合わせの際は、お客さまの名前と連絡先がわかるために、お名前、読み方、電話番号もメール内に記載していただけると幸いです。
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/organisms/Breadcrumb";
import SearchBox from "@/components/organisms/SearchBox";
import ListTitle from "@/components/organisms/ListTitle";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";

export default {
  components: {
    Breadcrumb,
    SearchBox,
    ListTitle,
    ButtonWrapper,
    Button,
  },
  async fetch() {
    await Promise.all([
      this.$store.dispatch("information/fetchRecent", {
        per_page: this.newsCount,
      }),
      // is_faq: よくある質問に表示（DB定義）
      this.$store.dispatch("helps/fetch", { is_faq: 1 }),
      this.$store.dispatch("helpCategories/fetch"),
    ]);
  },
  data() {
    return {
      placeholder: "お問い合わせを検索",
      breadcrumbs: [
        {
          id: 1,
          name: "HOME",
          url: "/",
        },
        {
          id: 2,
          name: "ヘルプ",
        },
      ],
      newsCount: 3,
    };
  },
  computed: {
    ...mapGetters({
      notices: "information/data",
      helps: "helps/data",
      helpCategories: "helpCategories/data",
    }),
  },
  methods: {
    contactOnChat() {
      this.$router.push("/");
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  max-width: $desktop;
  .mini-divider {
    margin: 0 -5px;
  }
}
.contact-email {
  a {
    color: inherit;
    border-bottom: 1px solid $black;
    padding-bottom: 5px;
    span::after {
      content: "";
      border: solid $black;
      border-width: 0 1px 1px 0;
      display: inline-block;
      padding: 4px;
      transform: rotate(-45deg);
      -webkit-transform: rotate(-45deg);
    }
  }
}
.notice-link {
  a {
    padding: 0 5px;
    margin: 0 5px 0 5px;
    position: relative;
  }
}
.menu-list li {
  a {
    padding: 15px 5px;
    margin: 0 5px 0 5px;
    position: relative;
    border-bottom: solid 1px #dbdbdb;
  }
}
</style>
