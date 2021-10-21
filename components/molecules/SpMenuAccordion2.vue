<template>
  <li>
    <a
      v-if="children.length && depth < 2"
      class="has-children"
      :class="[show ? 'is-open' : '']"
      :style="indent"
      @click="show = !show"
    >
      {{ name }}
    </a>
    <a v-else :style="indent" @click="handleSearchByCategory(id)">{{ name }}</a>
    <transition name="fade">
      <div v-if="children.length && depth < 2" v-show="show">
        <ul class="child-list">
          <SpMenuAccordion2
            v-for="child in children"
            :id="child.id"
            :key="child.id"
            :name="child.name"
            :children="child.children"
            :depth="depth + 1"
            @closeMenu="handleCloseMenu"
          />
        </ul>
      </div>
    </transition>
  </li>
</template>

<script>
import SpMenuAccordion2 from "./SpMenuAccordion2";

export default {
  name: "SpMenuAccordion2",
  components: {
    SpMenuAccordion2,
  },
  props: {
    id: {
      type: [String, Number],
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    children: {
      type: Array,
      default: () => [],
    },
    depth: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      show: false,
    };
  },
  computed: {
    indent() {
      return { paddingLeft: `${this.depth * 15 + 5}px` };
    },
  },
  methods: {
    handleSearchByCategory(id) {
      this.$emit("closeMenu");
      this.$router.push({
        name: "items",
        query: {
          online_category_id: id,
        },
      });
    },
    handleCloseMenu() {
      this.$emit("closeMenu");
    },
  },
};
</script>

<style lang="scss" scoped>
li {
  a {
    position: relative;
    display: block;
    width: 100%;
    font-size: 14px;
    padding: 15px 5px !important;
    border-bottom: 1px solid #dbdbdb;
    &::after {
      content: "";
      position: absolute;
      top: calc(50% - 6.5px);
      right: 5px;
      display: inline-block;
      width: 7px;
      height: 13px;
      background: url(../../assets/images/link-caret.png) no-repeat;
    }
    &.has-children {
      font-weight: bold;
    }
    &.has-children::after {
      top: calc(50% - 3.5px);
      width: 13px;
      height: 7px;
      background: url(../../assets/images/link-caret-down.png) no-repeat;
      transition: all 0.4s;
    }
    &.has-children.is-open::after {
      transform: rotate(180deg);
    }
  }
}
.child-list {
  border-left: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  a {
    padding-left: 20px !important;
  }
}
</style>
