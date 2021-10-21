<template>
  <News :place="place" />
</template>

<script>
import News from "@/components/pages/news/News";
import { NEWS } from "@/constants";

export default {
  components: {
    News,
  },
  data() {
    return {
      place: NEWS,
    };
  },
  head() {
    return {
      title: "ニュース一覧｜YAMADAYA onlinestore",
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "YAMADAYA onlinestoreのニュース一覧はこちら。YAMADAYA公式オンライン通販サイトでは、オリジナルブランドから人気のセレクトブランドまで多数取り揃えております。",
        },
      ],
    };
  },
};
</script>
