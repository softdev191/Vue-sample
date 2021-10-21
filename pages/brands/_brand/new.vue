<template>
  <NewItem :store-brand-index="storeBrand.value" />
</template>

<script>
import { mapGetters } from "vuex";
import NewItem from "@/components/pages/topcontent/NewItem";

export default {
  components: {
    NewItem,
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
      title: this.storeBrand.label + " - 新着商品一覧｜YAMADAYA onlinestore",
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            this.storeBrand.label +
            "の新着商品はこちら。YAMADAYA公式オンライン通販サイトでは、オリジナルブランドから人気のセレクトブランドまで多数取り揃えております。",
        },
      ],
    };
  },
};
</script>
