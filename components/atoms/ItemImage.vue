<template>
  <div>
    <img v-if="lazy" v-lazy-load :data-src="imageUrl" :alt="caption" />
    <img v-else :src="imageUrl" :alt="caption" />
  </div>
</template>

<script>
export default {
  name: "ItemImage",
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
  computed: {
    imageUrl() {
      const image = this.itemImage;

      if (typeof image !== "object" || !image) {
        return;
      }

      return image[`url_${this.size}`];
    },
    caption() {
      return this.itemImage ? this.itemImage.caption : "";
    },
  },
};
</script>
