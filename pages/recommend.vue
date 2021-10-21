<template>
  <Pickup />
</template>

<script>
import Pickup from "@/components/pages/topcontent/Pickup";

export default {
  components: {
    Pickup,
  },
  head() {
    return {
      title: "おすすめ商品｜YAMADAYA onlinestore",
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "おすすめ商品はこちら。YAMADAYA公式オンライン通販サイトでは、オリジナルブランドから人気のセレクトブランドまで多数取り揃えております。",
        },
      ],
    };
  },
};
</script>
