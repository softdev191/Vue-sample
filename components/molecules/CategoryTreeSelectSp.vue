<template>
  <div :class="{ wrap: tree[0] && tree[0].level != 2 }">
    <ul class="c-menu-list sp">
      <template v-for="(category, index) in tree">
        <template v-if="category && category.level < 3">
          <li v-if="!category.is_leaf" :key="index" class="l-li">
            <div
              class="l-acd-button"
              @click.stop="handleClickAccordion(category.id)"
            >
              <Badge
                v-if="category && category.level === 1 && tops[index]"
                class="badge-count"
              >
                {{ tops[index] }}
              </Badge>
              <div
                class="l-label"
                :class="{ 'l-category-top': category && category.level == 1 }"
              >
                {{ category.name }}
              </div>
              <div
                :class="[accStatus[category.id] ? 'angle-down' : 'angle-right']"
              />
            </div>
            <Checkbox
              :id="`sp-category-${category.id}`"
              :text="`${category.name}すべて`"
              :value="groupCheck[index]"
              @input="(data) => handleClickAll(index, data)"
              v-show="accStatus[category.id]"
              v-if="category && category.level == 1"
            />
            <CategoryTreeSelectSp
              v-show="accStatus[category.id]"
              :tree="category.children"
              :values="values"
              @input="(data) => $emit('input', data)"
            />
          </li>
          <li v-else :key="index" class="l-li">
            <Checkbox
              :id="`sp-category-${category.id}`"
              :text="category.name"
              :value="values[category.id]"
              @input="(data) => $emit('input', { obj: category, value: data })"
            />
          </li>
        </template>
        <template v-else>
          <li :key="index" class="l-li">
            <Checkbox
              :id="`sp-category-${category.id}`"
              :text="category.name"
              :value="values[category.id]"
              @input="(data) => $emit('input', { obj: category, value: data })"
            />
          </li>
        </template>
        <div
          v-if="category && category.level === 1"
          :key="`sep-${index}`"
          class="separator"
        />
      </template>
    </ul>
  </div>
</template>

<script>
import Badge from "@/components/atoms/Badge";
import Checkbox from "@/components/atoms/Checkbox.vue";
import CategoryTreeSelectSp from "@/components/molecules/CategoryTreeSelectSp";

export default {
  name: "CategoryTreeSelectSp",
  components: {
    Badge,
    Checkbox,
    CategoryTreeSelectSp,
  },
  props: {
    tree: {
      type: Array,
      default: () => [],
    },
    values: {
      type: Object,
      default: () => ({}),
    },
    tops: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      accStatus: {},
      groupCheck: {},
    };
  },
  methods: {
    handleClickAccordion(id) {
      this.$set(this.accStatus, id, !this.accStatus[id]);
    },
    handleClickAll(idx, value) {
      this.$set(this.groupCheck, idx, value);
      this.$emit("all", { idx, value });
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  padding: 0 0 0 10px;
}
.c-menu-list {
  .l-li {
    .l-link {
      padding-top: 0;
      padding-bottom: 0;
      border-bottom: solid 1px #dbdbdb;
      display: block;
    }
    .l-label {
      padding: 10px 0 10px 0;
      font-size: 10px;
    }
    .l-category-top {
      font-weight: bold;
    }
    .l-acd-button {
      position: relative;
      display: block;
    }
    &::v-deep .checkbox {
      .label {
        margin-left: 0;
        padding: 5px 0 10px 20px;
        font-size: 10px;
        border-bottom: 0;
        font-weight: normal;

        &::before {
          top: 5px;
          left: 0;
        }
        &::after {
          top: 7px;
          left: 5px;
        }
      }
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
  top: 12px;
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
  top: 12px;
  right: 10px;
  transition-duration: 0.3s;
}
.badge-count {
  position: absolute;
  top: 9px;
  right: 25px;
}
.separator {
  border-top: 1px solid #dbdbdb;
  margin-right: 10px;
}
</style>
