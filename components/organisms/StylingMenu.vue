<template>
  <div class="wrap mb10">
    <div class="menu">
      <div class="columns is-mobile is-gapless">
        <div class="column">
          <a @click="toggleComponent('switchCount')">
            <div class="stylings-count fs12">130</div>
          </a>
        </div>
        <div class="column">
          <a class="fs12" @click="toggleComponent('sort')">
            <img src="@/assets/images/sortable-icon.png" class="mb5" />
            <p>並び替え</p>
          </a>
        </div>
        <div class="column">
          <a @click="goToSearch">
            <img src="@/assets/images/narrowdown-icon.png" class="mb5" />
            <p>絞り込み</p>
          </a>
          <div class="count fs8">99</div>
        </div>
      </div>
      <div class="divider mb-4" />
    </div>
    <div v-show="showComponent === 'sort'" class="container mb-5">
      <h2 class="mb-4">絞り込み条件</h2>
      <TagList />
    </div>
  </div>
</template>

<script>
import TagList from "@/components/organisms/TagList.vue";

export default {
  components: {
    TagList,
  },
  data() {
    return {
      showComponent: "switchCount",
    };
  },
  methods: {
    toggleComponent(val) {
      this.showComponent = val;
    },
    goToSearch() {
      this.$router.push("/styling/search");
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  margin: 0 10px 10px 10px;
  max-width: $desktop;
  .is-gapless {
    margin-bottom: 0;
  }
  .columns {
    justify-content: flex-start;
    flex-wrap: wrap;
    .column {
      margin: 0 5px 5px 0;
      padding: 6px 10px !important;
      min-width: 30%;
      max-width: 40%;
      color: $dark-gray;
      border: 1px solid;
      border-radius: 20px;
      display: flex;
      justify-content: space-between;
      .close-icon {
        height: 1.5rem;
        width: 1.5rem;
      }
    }
  }
}
.wrap {
  .menu {
    height: 70px;
    padding: 0 !important;
    width: 100%;
    .divider {
      margin: 0;
    }
    .columns {
      margin-bottom: 10px;
      .column {
        text-align: center;
        flex: none;
        width: 33.3%;

        a {
          height: 50px;
          display: block;
          width: 100%;
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
          .stylings-count {
            font-weight: bold;
            line-height: 50px;
            &::after {
              content: "件";
              display: inline;
              font-weight: normal;
            }
          }
        }
        .count {
          display: block;
          position: absolute;
          top: 24px;
          right: calc(13% - 20px);
          color: $white;
          width: 18px;
          height: 18px;
          text-align: center;
          padding: 1px;
          border: 1px solid $black;
          background-color: $black;
          border-radius: 50%;
          z-index: 1;
        }
      }
    }
  }
}
</style>
