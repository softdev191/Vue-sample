<template>
  <div class="wrap">
    <div class="menu">
      <div class="columns is-mobile is-gapless">
        <div class="column">
          <a @click.prevent="handleSwitchDisplay">
            <SingleColumnIcon v-if="!imageDisplayMode" />
            <TwoColumnIcon v-else />
            <p>表示切替</p>
          </a>
        </div>
        <div class="column">
          <a @click.prevent="handleSwitchSort">
            <SortIcon />
            <p>並び替え</p>
          </a>
        </div>
        <div class="column condition-switch">
          <a @click.prevent="handleSwitchConditions">
            <FilterIcon />
            <p>絞り込み</p>
          </a>
          <Badge v-if="conditionCount > 0" class="badge-count">
            {{ conditionCount }}
          </Badge>
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Badge from "@/components/atoms/Badge";
import SingleColumnIcon from "@/assets/images/icons/single-column-icon.svg";
import TwoColumnIcon from "@/assets/images/icons/two-column-icon.svg";
import SortIcon from "@/assets/images/icons/sort-icon.svg";
import FilterIcon from "@/assets/images/icons/filter-icon.svg";

export default {
  name: "ItemListMenu",
  components: {
    Badge,
    SingleColumnIcon,
    TwoColumnIcon,
    SortIcon,
    FilterIcon,
  },
  props: {
    conditionCount: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      imageDisplayMode: false,
    };
  },
  methods: {
    handleSwitchDisplay() {
      this.$emit("swithDisplay");
      this.imageDisplayMode = !this.imageDisplayMode;
    },
    handleSwitchSort() {
      this.$emit("switchSort");
    },
    handleSwitchConditions() {
      this.$emit("switchConditions");
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  margin: 0 10px 10px 10px;
  max-width: $desktop;
  font-size: $size-7;
  .columns {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}
.wrap {
  margin-top: 25px;
  margin-bottom: 10px;

  .menu {
    height: unset;
    padding: 0 !important;
    width: 100%;
    position: relative;

    .columns {
      margin-bottom: 10px;

      &.is-gapless {
        margin-bottom: 0;
        padding-bottom: 10px;
        border-bottom: 1px solid #a7a7a7;
      }

      .column {
        text-align: center;
        flex: none;
        width: 33.3%;

        a {
          display: block;
          width: 100%;
          font-size: 8px;
          color: $black;
          position: relative;
          background: $white;
          &::before {
            content: attr(data);
            display: block;
          }
          &::after {
            content: "";
            display: block;
            position: absolute;
            bottom: 0;
            right: 0;
            left: 0;
            margin-bottom: -11px;
            justify-content: center;
            height: 1.5px;
            background-color: #333;
            transition: width 300ms;
            width: 0;
          }
          &:hover {
            &::after {
              width: 100%;
            }
          }
          img {
            margin-bottom: 5px;
          }
        }
      }
    }
  }
}
.condition-switch {
  position: relative;

  .badge-count {
    position: absolute;
    top: -4px;
    right: 28px;
  }
}
</style>
