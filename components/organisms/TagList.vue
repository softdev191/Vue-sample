<template>
  <div class="tags">
    <span v-for="(item, index) in items" :key="index" class="tag">
      {{ item.label }}
      <CancelButton @click="handleDelete(item)" />
    </span>
  </div>
</template>

<script>
import CancelButton from "@/components/atoms/CancelButton";

export default {
  name: "TagList",
  components: {
    CancelButton,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    handleDelete(item) {
      this.$emit("delete", item);
    },
  },
};
</script>

<style lang="scss" scoped>
.tags {
  margin-top: 0;
  display: flex;
  flex-wrap: wrap;

  .tag {
    border: solid 1px #707070;
    border-radius: 15px;
    padding-left: 1em;
    padding-right: 1em;
    font-size: $size-7;
    margin-right: 5px;
    background-color: $white;
    margin-bottom: 5px;

    @include touch {
      height: 32px;
    }
    @include desktop {
      height: 26px;
    }
  }
}
</style>
