<template>
  <figure class="image is-fullwidth mb-3">
    <ItemImage :item-image="itemImage" :size="size" :lazy="lazy" />
  </figure>
</template>

<script>
import ItemImage from "@/components/atoms/ItemImage";

export default {
  name: "ItemThumbnail",
  components: {
    ItemImage,
  },
  props: {
    itemImage: {
      type: Object,
      default: () => ({}),
    },
    lazy: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String,
      default: "m",
    },
  },
};
</script>
