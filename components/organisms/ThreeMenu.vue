<template>
  <div class="wrap">
    <div class="menu">
      <div class="columns is-mobile is-gapless">
        <div v-for="(item, index) in items" :key="index" class="column">
          <a @click.prevent="handleClickTab(index)">
            <p>{{ item.title }}</p>
          </a>
        </div>
      </div>
      <div class="divider mb-4" />
    </div>
    <div class="content" v-html="items[activeTabIndex].content"></div>
    <slot name="after" :active-tab-index="activeTabIndex" />
  </div>
</template>

<script>
export default {
  name: "ThreeMenu",
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      activeTabIndex: 0,
    };
  },
  methods: {
    handleClickTab(index) {
      this.activeTabIndex = index;
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  margin-top: 25px;
  position: relative;

  .menu {
    width: 100%;
    .divider {
      margin: 0;
    }
    .columns {
      margin-bottom: 0;
      height: 26px;
      .column {
        text-align: center;
        flex: none;
        width: 33.3%;
        margin: 0;

        a {
          display: block;
          width: 100%;
          font-size: 8px;
          color: #000;
          position: relative;
          background: #fff;
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
        }
      }
    }
  }
  .content {
    padding: 0 10px;
  }
}
</style>
