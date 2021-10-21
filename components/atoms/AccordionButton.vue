<template>
  <div
    class="accordion-button"
    :class="isOpen ? openCss : closeCss"
    @click="$emit('click')"
  ></div>
</template>

<script>
const DIRECTION_UP = "up";
const DIRECTION_DOWN = "down";
const DIRECTION_RIGHT = "right";

export default {
  name: "AccordionButton",
  emits: ["click"],
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    openDirection: {
      type: String,
      default: DIRECTION_UP,
      validate(value) {
        return [DIRECTION_UP, DIRECTION_DOWN, DIRECTION_RIGHT].includes(value);
      },
    },
    closeDirection: {
      type: String,
      default: DIRECTION_DOWN,
      validate(value) {
        return [DIRECTION_UP, DIRECTION_DOWN, DIRECTION_RIGHT].includes(value);
      },
    },
  },
  computed: {
    openCss() {
      return "angle-" + this.openDirection;
    },
    closeCss() {
      return "angle-" + this.closeDirection;
    },
  },
};
</script>

<style lang="scss" scoped>
.accordion-button {
  transition-duration: 0.3s;

  &:hover {
    cursor: pointer;
  }

  &.angle-up {
    border: solid black;
    border-width: 0 1px 1px 0;
    display: inline-block;
    padding: 4px;
    transform: rotate(225deg);
    -webkit-transform: rotate(225deg);
  }
  &.angle-down {
    border: solid black;
    border-width: 0 1px 1px 0;
    display: inline-block;
    position: absolute;
    padding: 4px;
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
  }
  &.angle-right {
    border: solid black;
    border-width: 0 1px 1px 0;
    display: inline-block;
    position: absolute;
    padding: 4px;
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
  }
}
</style>
