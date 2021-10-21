<template>
  <paginate
    v-if="totalCount > 0"
    v-model="innerCurrentPage"
    :page-count="pageCount"
    :page-range="pageRange"
    :margin-pages="marginPages"
    :prev-text="prevText"
    :next-text="nextText"
    :next-class="'next-item'"
    :prev-class="'prev-item'"
    :container-class="'pagination-list'"
    :page-class="'page-item'"
    :click-handler="clickHandler || defaultClickHandler"
  >
  </paginate>
</template>

<script>
export default {
  props: {
    clickHandler: {
      type: Function,
      default: null,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    perPage: {
      type: Number,
      default: 50,
    },
    totalCount: {
      type: Number,
      default: 0,
    },
    pageRange: {
      type: Number,
      default: 3,
    },
    marginPages: {
      type: Number,
      default: 2,
    },
    prevText: {
      type: String,
      default: "前ページ",
    },
    nextText: {
      type: String,
      default: "次ページ",
    },
    baseRoute: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      innerCurrentPage: null,
    };
  },
  computed: {
    pageCount() {
      return Math.ceil(this.totalCount / this.perPage);
    },
  },
  beforeMount() {
    this.innerCurrentPage = this.currentPage;
  },
  methods: {
    defaultClickHandler(page) {
      const baseRoute = this.baseRoute || this.$route;

      this.$router.push({
        ...baseRoute,
        query: {
          ...baseRoute.query,
          page,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination-list {
  justify-content: center;
  margin: 30px 0 60px;
}
@media screen and (min-width: 769px) {
  .pagination-list {
    justify-content: center;
  }
}
</style>
