<template>
  <client-only>
    <InfiniteLoadingExtra
      :identifier="identifier"
      :direction="direction"
      :spinner="spinner"
      @infinite="($state) => $emit('reached-end', $state)"
    >
      <template #no-results>{{ "" }}</template>
      <template #no-more>{{ "" }}</template>
      <template #error
        >エラーが発生しました。<Button
          type="secondary"
          @click="resetLoadingState"
        >
          再読み込み
        </Button></template
      >
    </InfiniteLoadingExtra>
  </client-only>
</template>

<script>
import InfiniteLoadingExtra from "@/components/atoms/InfiniteLoadingExtra";
import Button from "@/components/atoms/Button";

export default {
  name: "InfiniteLoading",
  emits: ["reached-end"],
  components: {
    InfiniteLoadingExtra,
    Button,
  },
  props: {
    direction: {
      type: String,
      default: "bottom",
      validate(value) {
        return ["top", "bottom", "right", "left"].includes(value);
      },
    },
    spinner: {
      type: String,
      default: "spiral",
    },
  },
  data() {
    return {
      identifier: 1,
    };
  },
  methods: {
    resetLoadingState() {
      // この値が更新されるとローディングがリセットされる
      this.identifier++;
    },
  },
};
</script>
