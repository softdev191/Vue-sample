<template>
  <div class="columns--wrapper">
    <div class="columns is-mobile is-multiline">
      <GoodsItem
        v-for="(item, index) in items"
        :key="index"
        class="column"
        :class="{
          four: desktopSize == 4,
          five: desktopSize == 5,
          one: imageDispalyMode,
        }"
        :item="item"
        :image-dispaly-mode="imageDispalyMode"
        @toggleFavorite="(data) => $emit('toggleFavorite', data)"
      />
    </div>
  </div>
</template>

<script>
import GoodsItem from "@/components/molecules/GoodsItem";

export default {
  components: {
    GoodsItem,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    desktopSize: {
      type: Number,
      default: 4,
    },
    namespace: {
      type: String,
      default: "top",
    },
    imageDispalyMode: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.columns.is-mobile.is-multiline {
  margin: 0;
}

.column {
  position: relative;
  padding: 0 1px;

  @include touch {
    flex: none !important;
    width: 50%;
    &.one::v-deep {
      width: calc(100% - 20px);
      margin: 0 10px !important;
    }
  }
  @include desktop {
    &.four::v-deep {
      flex: none;
      width: 25%;
      padding: 3px;
    }
    &.five::v-deep {
      flex: none;
      width: 20%;
      padding: 3px;
    }
  }
}
</style>
