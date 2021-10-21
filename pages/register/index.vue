<template>
  <div class="login-container">
    <div class="title">会員カードはお持ちですか？</div>
    <div class="full-divider"></div>
    <div class="">
      <NuxtLink to="/register/card" class="register-link">
        <span>もっている</span>
        <fa :icon="faChevronRight" />
      </NuxtLink>
    </div>
    <div class="full-divider"></div>
    <div class="">
      <NuxtLink to="/register/new" class="register-link">
        <span>もっていない</span>
        <fa :icon="faChevronRight" />
      </NuxtLink>
    </div>
    <p class="text">会員カードとは、下記のイメージのようなカードです。</p>
    <CardImage />
    <div class="full-divider"></div>
  </div>
</template>

<script>
import CardImage from "@/components/atoms/CardImage";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default {
  components: {
    CardImage,
  },
  computed: {
    faChevronRight() {
      return faChevronRight;
    },
  },
  head() {
    return {
      title: "新規登録",
    };
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 14px;
  font-weight: 600;
  margin: 25px 0 30px;
}
.text {
  font-size: 10px;
  margin: 4px 0;
}
.register-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: $black;
  padding: 16px 0;
}
</style>
