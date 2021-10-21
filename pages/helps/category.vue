<template>
  <div class="container">
    <Breadcrumb :items="breadcrumbs" />
    <SearchBox :placeholder="placeholder" />
    <ListTitle>アカウント関連</ListTitle>
    <div class="mb50">
      <ul
        v-for="(categoryQuestion, index) in categoryQuestions"
        :key="index"
        class="menu-list is-size-6"
      >
        <li class="fs14">
          <a :href="'/help/detail?param=' + categoryQuestion.param">
            {{ categoryQuestion.content }}
          </a>
        </li>
      </ul>
    </div>
    <ListTitle>サブカテゴリ</ListTitle>
    <div class="mb50">
      <ul
        v-for="(category, index) in subCategories"
        :key="index"
        class="menu-list is-size-6"
      >
        <li class="fs14">
          <a :href="'/help/category?param=' + category.param">
            {{ category.content }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import SearchBox from "@/components/organisms/SearchBox";
import ListTitle from "@/components/organisms/ListTitle";
export default {
  components: {
    SearchBox,
    ListTitle,
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
          url: "/help",
        },
        {
          id: 3,
          name: "カテゴリ内ヘルプ",
        },
      ],
      categoryQuestions: [
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
        {
          index: 3,
          param: "",
          content: "マイページに入ることが出来ない",
        },
        {
          index: 4,
          param: "",
          content: "お支払い方法について",
        },
      ],
      subCategories: [
        {
          index: 1,
          param: "",
          content: "退会関連",
        },
        {
          index: 2,
          param: "",
          content: "お届け先情報関連",
        },
      ],
    };
  },
  computed: {},
  methods: {},
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
      border-bottom: solid 1px #dbdbdb;
    }
  }
}
</style>
