<template>
  <div>
    <NotFoundPage v-if="isNotFoundError" />
    <ErrorPage v-else :message="message" />
  </div>
</template>

<script>
import * as httpStatusCode from "@/constants/httpStatusCode";
import NotFoundPage from "@/pages/404";
import ErrorPage from "@/pages/500";

export default {
  layout: "top",
  components: {
    NotFoundPage,
    ErrorPage,
  },
  props: {
    error: {
      type: [Object, Function],
      default: () => ({}),
    },
  },
  computed: {
    message() {
      try {
        const { message } = this.error;

        const error = JSON.parse(message) || {};

        return error.message;
      } catch (error) {
        return null;
      }
    },
    isNotFoundError() {
      return this.error.statusCode === httpStatusCode.NOT_FOUND;
    },
  },
};
</script>
