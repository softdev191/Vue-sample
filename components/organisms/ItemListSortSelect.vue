<template>
  <div class="container s-wrapper">
    <div class="sort-check">
      <ul class="sort-check__list">
        <li v-for="(option, index) in sortOptions" :key="index">
          <Radio
            v-model="sort"
            :option-value="option.id"
            :text="option.text"
            name="item-sort"
          />
        </li>
      </ul>
      <SortButton @click="handleSort" />
    </div>
  </div>
</template>

<script>
import SortButton from "@/components/organisms/SortButton";
import Radio from "@/components/atoms/Radio";

export default {
  name: "ItemListSortSelect",
  components: {
    SortButton,
    Radio,
  },
  props: {
    sortOptions: {
      type: Array,
      default: () => [],
    },
    selectedSort: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      sort: this.selectedSort,
    };
  },
  methods: {
    handleSort() {
      this.$emit("sort", this.sort);
    },
  },
};
</script>

<style lang="scss" scoped>
.s-wrapper {
  position: absolute;
  width: 100%;
  top: 100%;
  z-index: 10000;
  background: #fff;
  box-shadow: 0 4px 2px -2px rgba(15, 15, 15, 0.5);

  .sort-check__list {
    margin-bottom: 20px;
    margin-top: 20px;

    &::v-deep .label {
      border-bottom: 0;
    }
  }
}
</style>
