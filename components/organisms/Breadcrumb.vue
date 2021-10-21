<template>
  <div class="container ml10 mt10 mb10">
    <span v-for="(item, id) in items" :key="id">
      <template v-if="item.url">
        <nuxt-link :to="item.url"
          ><span>{{ item.name }}</span></nuxt-link
        >
        <span v-if="item.symbol">{{ item.symbol }}</span>
        <span v-else>></span>
      </template>
      <template v-else>
        <span>{{ item.name }}</span>
      </template>
    </span>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.container {
  max-width: $desktop;
  font-size: 8px;
  a {
    color: inherit;
  }
}
</style>
