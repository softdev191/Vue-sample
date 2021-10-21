<template>
  <div v-if="information" class="container">
    <Breadcrumb :items="breadcrumbs" />
    <ListTitle class="mb10">{{ information.title }}</ListTitle>
    <div
      class="mr10 ml10 mb50 is-size-7 ck-content"
      v-html="information.body"
    ></div>
  </div>
</template>

<script>
import * as log from "@/utils/log";
import Breadcrumb from "@/components/organisms/Breadcrumb";
import ListTitle from "@/components/organisms/ListTitle";

export default {
  components: {
    Breadcrumb,
    ListTitle,
  },
  fetchOnServer: false,
  async fetch() {
    try {
      const { token, key } = this.$route.query;
      if (!token) {
        throw new Error("Invalid request");
      }
      await this.$store.dispatch("information/adminPreview", { key, token });
    } catch (error) {
      log.debug(error);
      this.$toast.error("プレビュー表示に失敗しました。");
    }
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
          name: "お知らせ詳細",
        },
      ],
    };
  },
  computed: {
    information() {
      return this.$store.getters["information/detail"];
    },
  },
};
</script>
