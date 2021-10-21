<template>
  <NewItem />
</template>

<script>
import NewItem from "@/components/pages/topcontent/NewItem";

export default {
  components: {
    NewItem,
  },
  head() {
    return {
      title: "新着商品｜YAMADAYA onlinestore",
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "新着商品はこちら。YAMADAYA公式オンライン通販サイトでは、オリジナルブランドから人気のセレクトブランドまで多数取り揃えております。",
        },
      ],
    };
  },
};
</script>
