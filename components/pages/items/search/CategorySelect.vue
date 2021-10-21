<template>
  <div class="wrapper">
    <CategoryTreeSelectSp
      :tree="onlineCategoryTree"
      :values="inputs"
      :tops="selectedCategoryCounts"
      @input="(data) => handleCategoryChange(data)"
      @all="(data) => handleCategoryAll(data)"
    />
  </div>
</template>

<script>
import CategoryTreeSelectSp from "@/components/molecules/CategoryTreeSelectSp";
import { mapGetters } from "vuex";

export default {
  name: "CategorySelect",
  components: {
    CategoryTreeSelectSp,
  },
  props: {
    inputs: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      inputGroup: {},
    };
  },
  computed: {
    ...mapGetters({
      categoryGroupTokens: "master/categoryGroupTokens",
      categoryOptionGroup: "master/categoryOptionGroup",
      onlineCategoryTree: "master/onlineCategoryTree",
      onlineCategoryDict: "master/onlineCategoryDict",
    }),
    selectedCategoryCounts() {
      const tree = this.onlineCategoryTree;
      const values = this.inputs;
      return tree.map((subTree, idx) => {
        let selectedCt = 0;
        Object.keys(this.onlineCategoryDict).forEach((key) => {
          const leaf = this.onlineCategoryDict[key];
          if (leaf.root_id === subTree.id && values[leaf.id]) {
            selectedCt += 1;
          }
        });
        return selectedCt;
      });
    },
  },
  mounted() {
    this.assignDefaultAllCheck();
  },
  methods: {
    resetInput() {
      Object.keys(this.inputGroup).forEach((key) => {
        this.$set(this.inputGroup, key, false);
      });
    },
    assignDefaultAllCheck() {
      const inputs = this.inputs;
      const groups = this.categoryOptionGroup;

      Object.keys(groups).forEach((token) => {
        const group = groups[token];
        const ids = group.options.map(({ id }) => id);

        if (ids.length === 0) {
          return;
        }

        const selectedCount = ids.reduce(
          (sum, id) => sum + Number(Boolean(inputs[id])),
          0
        );

        if (selectedCount === ids.length) {
          this.$set(this.inputGroup, token, true);
        }
      });
    },
    handleCategoryChange(data) {
      this.$set(this.inputs, data.obj.id, data.value);
    },
    handleCategoryAll(data) {
      const tree = this.onlineCategoryTree[data.idx];
      const selectAllTree = (node) => {
        if (node.is_leaf || node.level === 3) {
          this.$set(this.inputs, node.id, data.value);
        } else {
          node.children.forEach((child) => {
            selectAllTree(child);
          });
        }
      };
      selectAllTree(tree);
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 24px 2% 75px;
}
::v-deep .checkbox .label {
  border-bottom: 0;
  padding-bottom: 0;
}

.group {
  padding: 12px 0 29px 0;

  &.border {
    border-bottom: solid 1px #e3e3e3;
  }

  .members {
    margin-top: 6px;

    .column {
      padding-bottom: 0;
      padding-top: 0;
      margin-top: 4px;

      &::v-deep .checkbox {
        .label {
          font-weight: normal;
        }
      }
    }
  }
}

.columns {
  flex-wrap: wrap;
}
</style>
