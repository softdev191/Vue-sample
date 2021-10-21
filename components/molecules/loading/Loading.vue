<template>
  <component :is="type" v-show="show" v-bind="$attrs" />
</template>

<script>
import Spiner from "@/components/atoms/loading/Spiner";
import Indicator from "@/components/atoms/loading/Indicator";

export const TYPE_SPINER = "spiner";
export const TYPE_INDICATOR = "indicator";

export default {
  name: "Loading",
  components: {
    Spiner,
    Indicator,
  },
  props: {
    type: {
      type: String,
      default: TYPE_SPINER,
      validate(value) {
        return [TYPE_SPINER, TYPE_INDICATOR].includes(value);
      },
    },
    show: {
      type: Boolean,
      default: true,
    },
  },
};
</script>
