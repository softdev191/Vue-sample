<template>
  <div>{{ message }}</div>
</template>

<script>
export default {
  layout: "top",
  props: {
    message: {
      type: String,
      default: "エラーが発生しました。",
    },
  },
};
</script>
