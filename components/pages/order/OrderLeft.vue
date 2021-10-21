<template>
  <div class="order-left-section">
    <div class="order-left-section-title">購入完了まで</div>
    <div class="order-left-section-content">
      <ul class="order-process-list">
        <li
          v-for="(item, index) in steps"
          :key="index"
          class="order-process-list-item"
          :class="{ active: index < step }"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    step: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    steps() {
      return ["注文内容", "注文内容確認", "注文完了"];
    },
  },
};
</script>

<style lang="scss" scoped>
.order-left-section {
  .order-left-section-title {
    font-size: 14px;
    font-weight: 600;
    border-bottom: 1px solid $black;
    margin-bottom: 20px;
    padding: 0 5px;
  }
  .order-left-section-content {
    .order-process-list {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .order-process-list-item {
        color: #a7a7a7;
        font-size: 14px;
        &.active {
          color: $black;
        }
        &:not(:last-child) {
          &::after {
            content: "▼";
            display: block;
            font-size: 10px;
            color: $black;
            text-align: center;
            margin: 16px 0;
          }
        }
      }
    }
  }
}
</style>
