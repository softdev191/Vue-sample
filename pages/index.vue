<template>
  <Top />
</template>

<script>
import Top from "@/components/pages/topcontent/Top";

export default {
  components: {
    Top,
  },
  head() {
    return {
      title: "YAMADAYA onlinestore (公式通販サイト)",
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "YAMADAYA公式オンライン通販サイトでは、オリジナルブランドから人気のセレクトブランドまで多数取り揃えております。",
        },
      ],
    };
  },
};
</script>
