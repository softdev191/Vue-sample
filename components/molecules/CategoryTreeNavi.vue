<template>
  <ul class="c-menu-list">
    <template v-for="(category, index) in tree">
      <li
        v-if="category && category.level < 3 && !category.is_leaf"
        :key="index"
        class="l-li"
      >
        <a
          href
          class="l-acd-button"
          @click.prevent="handleClickAccordion(category.id)"
        >
          <div class="l-label">{{ category.name }}</div>
          <div
            :class="[accStatus[category.id] ? 'angle-down' : 'angle-right']"
          />
        </a>
        <CategoryTreeNavi
          v-show="accStatus[category.id]"
          :tree="category.children"
        />
      </li>
      <li v-else :key="index" class="l-li">
        <nuxt-link
          :to="{
            name: 'items',
            query: { online_category_id: [category.id] },
          }"
          class="l-link"
          ><div class="l-label">{{ category.name }}</div></nuxt-link
        >
      </li>
    </template>
  </ul>
</template>

<script>
import CategoryTreeNavi from "@/components/molecules/CategoryTreeNavi";

export default {
  name: "CategoryTreeNavi",
  components: {
    CategoryTreeNavi,
  },
  props: {
    tree: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      accStatus: {},
    };
  },
  methods: {
    handleClickAccordion(id) {
      this.$set(this.accStatus, id, !this.accStatus[id]);
    },
  },
};
</script>

<style lang="scss" scoped>
.c-menu-list {
  .l-li {
    .l-link {
      padding-top: 0;
      padding-bottom: 0;
      border-bottom: solid 1px #dbdbdb;
      display: block;
    }
    .l-label {
      padding: 12px 0 12px 0;
      font-size: 14px;
    }
    .l-acd-button {
      position: relative;
      display: block;
      border-bottom: solid 1px #dbdbdb;
    }
  }
}
.angle-down {
  border: solid black;
  border-width: 0 1px 1px 0;
  display: inline-block;
  position: absolute;
  padding: 4px;
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  top: 20px;
  right: 10px;
  transition-duration: 0.3s;
}
.angle-right {
  border: solid black;
  border-width: 0 1px 1px 0;
  display: inline-block;
  position: absolute;
  padding: 4px;
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  top: 18px;
  right: 10px;
  transition-duration: 0.3s;
}
</style>
