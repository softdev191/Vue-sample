<template>
  <div class="accordion-component">
    <div class="accordion--header" @click="open = !open">
      <slot name="head"></slot>
      <fa :icon="icon" class="accordion--icon" />
    </div>
    <div v-show="open" class="accordion--body">
      <slot name="body"></slot>
    </div>
  </div>
</template>

<script>
import { faChevronRight, faChevronUp } from "@fortawesome/free-solid-svg-icons";

export default {
  data() {
    return {
      open: false,
    };
  },
  computed: {
    icon() {
      return this.open ? faChevronUp : faChevronRight;
    },
  },
};
</script>

<style lang="scss" scoped>
.accordion--header {
  padding: 0 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
