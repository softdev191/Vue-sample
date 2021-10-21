<template>
  <News :place="place" :store-brand="storeBrand.value" />
</template>

<script>
import { mapGetters } from "vuex";
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
  computed: {
    ...mapGetters({
      enums: "master/enums",
    }),
    storeBrand() {
      return this.enums.common__store_brand.find(
        ({ key }) => key.toLowerCase() === this.$route.params.brand
      );
    },
  },
  head() {
    return {
      title: this.storeBrand.label + " - ニュース一覧｜YAMADAYA onlinestore",
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            this.storeBrand.label +
            "のニュース一覧はこちら。YAMADAYA公式オンライン通販サイトでは、オリジナルブランドから人気のセレクトブランドまで多数取り揃えております。",
        },
      ],
    };
  },
};
</script>
