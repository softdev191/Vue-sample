<template>
  <div v-if="information" class="container">
    <Breadcrumb :items="breadcrumbs" />
    <ListTitle class="mb10">{{ information.title }}</ListTitle>
    <div
      class="mr10 ml10 mb50 is-size-7 ck-content"
      v-html="information.body"
    ></div>
    <ListTitle class="mb10">直近のお知らせ</ListTitle>
    <div class="mb50">
      <ul
        v-for="(info, index) in recentInformation"
        :key="index"
        class="menu-list is-size-6"
      >
        <li class="fs14">
          <NuxtLink :to="`/information/${info.id}`">
            {{ info.title }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Breadcrumb from "@/components/organisms/Breadcrumb";
import ListTitle from "@/components/organisms/ListTitle";

export default {
  components: {
    Breadcrumb,
    ListTitle,
  },
  validate({ params }) {
    return /^\d+$/.test(params.id);
  },
  async fetch() {
    const { id } = this.$route.params;
    await Promise.all([
      this.$store.dispatch("information/get", { id }),
      this.$store.dispatch("information/fetchRecent", { excluded_id: id }),
    ]);
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
    informationId() {
      return Number(this.$route.params.id);
    },
    recentInformation() {
      return this.$store.getters["information/data"];
    },
    information() {
      return this.$store.getters["information/detail"];
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.container {
  max-width: $desktop;
}
.buttons {
  justify-content: space-between;
  padding: 0 10px;
}
.button {
  width: 48.6%;
  height: 42px;
  border-radius: 0;
  margin: 0 !important;
  background-color: $white;
  border-color: $black;
  box-shadow: none;
  &:hover {
    background-color: $dim-gray;
    color: $white;
    border-color: $dim-gray;
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
