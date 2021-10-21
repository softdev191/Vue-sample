<template>
  <div class="g-wrapper">
    <nuxt-link
      class="image-link"
      :to="{
        name: 'items-detail-product_number',
        params: { product_number: item.product_number },
      }"
    >
      <div class="i-wrapper">
        <ItemThumbnail
          :item-image="item.item_images[0]"
          :size="imageDispalyMode ? 'l' : 'm'"
        />
        <SoldOutOverlay v-if="item.is_sold_out" class="sold-out" />
      </div>
      <div
        v-if="item.sales_types && item.sales_types.length > 0"
        class="mb-3 mx-3"
      >
        <template v-for="(salesType, index) in item.sales_types">
          <span
            :key="`${index}-tag`"
            class="tags"
            :style="{ color: salesType.text_color }"
          >
            {{ salesType.name }}
          </span>
          <span
            v-if="index < item.sales_types.length - 1"
            :key="`${index}-sep`"
            class="tags-separator"
            >/</span
          >
        </template>
      </div>
      <div class="brand mb-1 mx-3">
        {{ item.brand ? item.brand.name : "" }}
      </div>
      <div class="name mb-1 mx-3">{{ item.display_name }}</div>
      <template v-if="hasDiscountedPrice && item.can_display_original_price">
        <div class="price mb-1 mx-3">
          <small class="original-price"
            ><s>{{ yen(item.retail_price) }}(税込)</s></small
          >
          <span class="sale-price"
            >{{ yen(item.displayed_sale_price) }}(税込)</span
          >
        </div>
      </template>
      <template v-else>
        <div class="price mb-1 mx-3">
          {{ yen(item.displayed_sale_price) }}(税込)
        </div>
      </template>
      <Favorite
        class="favorite-button"
        :class="{ 'image-mode': imageDispalyMode }"
        :is-added="item.is_favorite"
        @click="handleClickFavorite(item)"
      />
    </nuxt-link>
  </div>
</template>

<script>
import Favorite from "@/components/atoms/Favorite";
import ItemThumbnail from "@/components/atoms/ItemThumbnail";
import SoldOutOverlay from "@/components/atoms/SoldOutOverlay";
import { yen } from "@/utils/format";

export default {
  name: "GoodsItem",
  components: {
    Favorite,
    ItemThumbnail,
    SoldOutOverlay,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    imageDispalyMode: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    hasDiscountedPrice() {
      return this.item.retail_price > this.item.displayed_sale_price;
    },
  },
  methods: {
    yen(...args) {
      return yen(...args);
    },
    handleClickFavorite() {
      this.$emit("toggleFavorite", this.item);
    },
  },
};
</script>

<style lang="scss" scoped>
.tags {
  color: $dark-pink;
  font-weight: 600;
  display: inline;
}
.tags-separator {
  color: $middle-gray;
  font-weight: 600;
  margin-right: 3px;
}
.product-item {
  .image {
    img {
      min-height: 140px;
    }
  }
}
.sale-price {
  color: $dark-red;
}
.original-price {
  color: $dim-gray;
}
.column.g-wrapper {
  padding-bottom: 36px;

  .image-link {
    display: block;
    position: relative;

    .favorite-button {
      display: block;
      position: absolute;
      top: 2.5%;
      right: 2.5%;
    }
  }
}
.i-wrapper {
  position: relative;

  .sold-out {
    position: absolute;
  }
}
</style>
