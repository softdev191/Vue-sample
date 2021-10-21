<template>
  <div class="complete">
    <p class="complete-title">
      <slot name="title" />
    </p>
    <p class="complete-text">
      <slot name="body" />
    </p>
  </div>
</template>

<style lang="scss" scoped>
.complete {
  text-align: center;
  padding: 35px 0;
  > .complete-title {
    color: #6c6c6c;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 5px;
  }
  > .complete-text {
    color: #6c6c6c;
    font-size: 10px;
  }
}
</style>
