<template>
  <div class="s-item--acc--product columns is-mobile">
    <div class="column is-2-mobile is-1-desktop s-item--acc--product--photo">
      <ItemThumbnail :item-image="item.item_images[0]" size="s" :lazy="false" />
    </div>
    <div class="column is-10-mobile is-11-desktop s-item--acc--product--info">
      <div v-if="item.brand" class="s-item--acc--product--info--brand">
        {{ item.brand.name }}
      </div>
      <div class="s-item--acc--product--info--name">
        {{ item.display_name }}
      </div>
    </div>
  </div>
</template>

<script>
import ItemThumbnail from "@/components/atoms/ItemThumbnail";

export default {
  name: "ItemStockSummary",
  components: {
    ItemThumbnail,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.s-item--acc--product {
  margin-top: 8px;

  &--photo {
    padding-right: 4px;
    padding-left: 4px;
  }

  &--info {
    display: flex;
    justify-content: center;
    flex-direction: column;

    &--brand {
      margin-top: -12.5px;
    }

    &--name {
      font-size: 16px;
      margin-top: -2px;

      @include desktop {
        font-size: 20px;
      }
    }
  }
}
</style>
