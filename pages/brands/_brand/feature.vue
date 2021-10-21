<template>
  <Feature :place="place" :store-brand="storeBrand.value" />
</template>

<script>
import { mapGetters } from "vuex";
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
      title: this.storeBrand.label + " - 特集一覧｜YAMADAYA onlinestore",
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            this.storeBrand.label +
            "の特集一覧はこちら。YAMADAYA公式オンライン通販サイトでは、オリジナルブランドから人気のセレクトブランドまで多数取り揃えております。",
        },
      ],
    };
  },
};
</script>
