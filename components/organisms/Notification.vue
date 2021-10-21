<template>
  <div v-if="information" class="wrap information--wrapper">
    <div v-for="(item, index) in infoTotal" :key="index">
      <NuxtLink
        :to="`/information/${item.id}`"
        class="columns is-mobile is-gapless pb-1"
      >
        <span class="date is-size-7 pr-4">
          {{ item.publish_at | date }}
        </span>
        <span class="is-size-6">{{ item.title }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    information() {
      return this.$store.getters["information/data"];
    },
    informationDetail() {
      return this.$store.getters["information/detail"];
    },
    infoTotal() {
      return this.information
        .concat(this.informationDetail || [])
        .sort((info1, info2) => info1.priority - info2.priority)
        .filter((info) => info.is_store_top);
    },
  },
};
</script>

<style lang="scss" scoped>
.information--wrapper {
  width: 75%;
  margin: auto;
  .date {
    padding-top: 3px;
  }
}
.wrap {
  padding-top: 20px;
}
</style>
