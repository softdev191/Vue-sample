<template>
  <Pickup :store-brand-index="storeBrand.value" />
</template>

<script>
import { mapGetters } from "vuex";
import Pickup from "@/components/pages/topcontent/Pickup";

export default {
  components: {
    Pickup,
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
      title:
        this.storeBrand.label + " - おすすめ商品一覧｜YAMADAYA onlinestore",
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            this.storeBrand.label +
            "のおすすめ商品はこちら。YAMADAYA公式オンライン通販サイトでは、オリジナルブランドから人気のセレクトブランドまで多数取り揃えております。",
        },
      ],
    };
  },
};
</script>
