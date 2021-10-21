<template>
  <Button
    class="item-detail-button"
    :class="getCartButtonCss(itemDetail)"
    :theme="getButtonTheme(itemDetail)"
    :disabled="isDisabled(itemDetail)"
    :pending="cartPending"
    @click.prevent="handleClick"
  >
    {{ getCartButtonLabel(itemDetail) }}
  </Button>
</template>

<script>
import Button from "@/components/atoms/Button";
import addToCartMixin from "@/components/organisms/mixins/addToCartMixin";

export default {
  components: {
    Button,
  },
  mixins: [addToCartMixin],
  props: {
    itemDetail: {
      type: Object,
      default: null,
    },
    cartPending: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleClick(event) {
      this.$emit("click", event);
    },
  },
};
</script>

<style lang="scss">
.item-detail-button > button {
  &.disabled {
    border: 0;
    background-color: #dbdbdb;
    color: #fff !important;
    opacity: 1;
  }
}
</style>
