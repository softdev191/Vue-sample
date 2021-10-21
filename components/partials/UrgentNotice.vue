<template>
  <div>
    <client-only>
      <div v-if="urgentNotice.body" class="urgent-notice">
        <div class="content ck-content" v-html="urgentNotice.body"></div>
      </div>
    </client-only>
  </div>
</template>

<script>
export default {
  computed: {
    urgentNotice() {
      return this.$store.getters["urgentNotice/data"];
    },
  },
};
</script>

<style lang="scss" scoped>
.urgent-notice {
  color: $white;
  background: $matterhorn;
  text-align: center;
  padding: 12px 0;
  font-size: 12px;
  min-height: 40px;
  .content {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}
</style>
