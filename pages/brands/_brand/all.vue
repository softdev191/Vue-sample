<template>
  <AllItem :store-brand-index="storeBrand.value" />
</template>

<script>
import { mapGetters } from "vuex";
import AllItem from "@/components/pages/topcontent/AllItem";

export default {
  components: {
    AllItem,
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
      title: this.storeBrand.label + " - すべての商品｜YAMADAYA onlinestore",
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            this.storeBrand.label +
            "のすべての商品はこちら。YAMADAYA公式オンライン通販サイトでは、オリジナルブランドから人気のセレクトブランドまで多数取り揃えております。",
        },
      ],
    };
  },
};
</script>
