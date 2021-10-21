<template>
  <div v-show="false"></div>
</template>

<script>
import * as log from "@/utils/log";

export default {
  fetchOnServer: false,
  async fetch() {
    try {
      const { token, key } = this.$route.query;

      if (!token) {
        throw new Error("Invalid request");
      }

      await this.$store.dispatch("item/adminPreview", { key, token });
    } catch (error) {
      log.debug(error);

      this.$router.push("/404");
    }
  },
};
</script>
