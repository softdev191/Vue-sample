<template>
  <div class="members-card-images">
    <div class="front-image">
      <span>表面</span>
      <div class="image-wrapper">
        <img src="@/assets/images/members-card-front.png" alt="" />
      </div>
    </div>
    <div class="back-image">
      <span>裏面</span>
      <div class="image-wrapper">
        <img src="@/assets/images/members-card-back.png" alt="" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.members-card-images {
  display: flex;
  margin-bottom: 14px;
  > .front-image {
    margin-right: 20px;
  }
}
</style>
