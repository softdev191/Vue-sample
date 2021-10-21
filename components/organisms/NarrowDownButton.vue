<template>
  <div class="columns is-mobile is-centered">
    <ButtonWrapper theme="flex">
      <Button theme="light" @click="$emit('reset')">すべての条件を解除</Button>
      <Button theme="dark" @click="$emit('search')">
        絞り込み結果を見る
      </Button>
    </ButtonWrapper>
  </div>
</template>

<script>
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";

export default {
  components: {
    ButtonWrapper,
    Button,
  },
};
</script>

<style lang="scss" scoped>
.columns {
  margin: 0 10px !important;
  .column {
    padding: 0;
  }
}
</style>
