<template>
  <Feature :place="place" />
</template>

<script>
import Feature from "@/components/pages/feature/Feature";
import { FEATURES } from "@/constants";

export default {
  components: {
    Feature,
  },
  data() {
    return {
      place: FEATURES,
    };
  },
  head() {
    return {
      title: "特集一覧｜YAMADAYA onlinestore",
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "YAMADAYA onlinestoreの特集一覧はこちら。YAMADAYA公式オンライン通販サイトでは、オリジナルブランドから人気のセレクトブランドまで多数取り揃えております。",
        },
      ],
    };
  },
};
</script>
