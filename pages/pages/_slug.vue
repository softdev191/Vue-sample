<template>
  <div v-if="page" class="container">
    <h2 class="page-title has-text-weight-bold has-text-centered mt10 mb30">
      {{ page.title }}
    </h2>
    <div class="content ck-content" v-html="page.body"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import * as httpStatusCode from "@/constants/httpStatusCode";
import { isNotFoundError } from "@/plugins/axios";

export default {
  async asyncData({ store, route, error }) {
    const slug = route.params.slug;
    await Promise.all([
      store.dispatch("pages/get", { slug }).catch((httpError) => {
        if (isNotFoundError(httpError)) {
          return error({ statusCode: httpStatusCode.NOT_FOUND });
        } else {
          return error({
            statusCode: httpStatusCode.INTERNAL_SERVER_ERROR,
          });
        }
      }),
    ]);
  },
  data() {
    return { strippedHtml: null };
  },
  computed: {
    ...mapGetters({
      page: "pages/page",
    }),
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.container {
  @include touch {
    margin: 0 10px;
  }
  .content {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}
</style>
