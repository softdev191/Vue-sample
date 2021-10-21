<template>
  <ButtonWrapper theme="full">
    <Button
      theme="dark"
      :disabled="disabled"
      :pending="pending"
      @click="$emit('click')"
    >
      注文確認に進む
    </Button>
  </ButtonWrapper>
</template>

<script>
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";

export default {
  components: {
    ButtonWrapper,
    Button,
  },
  emits: ["click"],
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    pending() {
      return this.$store.getters["common/pending"];
    },
  },
};
</script>
