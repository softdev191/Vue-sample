<template>
  <div class="s-item--acc--stock__list columns is-mobile">
    <div class="s-item--acc--stock__list--color is-2 column">
      <div
        class="color-panel"
        :class="{ 'is-white': isWhite }"
        :style="{
          backgroundColor: color.color_panel,
        }"
      ></div>
    </div>
    <div class="s-item--acc--stock__list--info is-8 column">
      {{ `${color.id} ${color.display_name} ${size.name}` }}
    </div>
    <div class="s-item--acc--stock__list--stock is-2 column">
      {{ stockSign }}
    </div>
  </div>
</template>

<script>
const STOCK_AVAILABLE = 2;
const STOCK_ZERO = 0;

export default {
  name: "ItemStoreListSku",
  props: {
    itemDetailStore: {
      type: Object,
      required: true,
    },
    itemDetail: {
      type: Object,
      required: true,
    },
  },
  computed: {
    color() {
      return this.itemDetail.color;
    },
    size() {
      return this.itemDetail.size;
    },
    stockSign() {
      const stock = this.itemDetailStore.stock || 0;

      if (stock >= STOCK_AVAILABLE) {
        return "○";
      }

      if (stock > STOCK_ZERO) {
        return "△";
      }

      return "×";
    },
    isWhite() {
      return new RegExp("^#f{3,6}$", "i").test(this.color.color_panel);
    },
  },
};
</script>

<style lang="scss" scoped>
.s-item--acc--stock__list {
  border-bottom: 1px solid #d6d6d6;

  &--color {
    .color-panel {
      height: 24px;
      width: 24px;

      &.is-white {
        border: 1px solid #d6d6d6;
      }
    }
  }
  &--info {
    padding-top: 9.5px;
  }
  &--stock {
    padding-top: 9.5px;
    text-align: center;
  }
}
</style>
