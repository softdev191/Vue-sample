<template>
  <VerifyClosedMarketFormDialog ref="dialog" />
</template>

<script>
import VerifyClosedMarketFormDialog from "@/components/organisms/VerifyClosedMarketFormDialog";
import { isNotFoundError } from "@/plugins/axios";
import * as httpStatusCode from "@/constants/httpStatusCode";

export default {
  components: {
    VerifyClosedMarketFormDialog,
  },
  async asyncData({ store, route, error }) {
    const productNumber = route.params.product_number;
    const id = route.params.id;

    await Promise.all([
      store
        .dispatch("item/getClosedMarket", { productNumber, id })
        .catch((httpError) => {
          if (isNotFoundError(httpError)) {
            error({ statusCode: httpStatusCode.NOT_FOUND });
          } else {
            error({ statusCode: httpStatusCode.INTERNAL_SERVER_ERROR });
          }
        }),
    ]);
  },
  validate({ params }) {
    return /^[0-9]+$/.test(params.product_number) && /^[0-9]+$/.test(params.id);
  },
  computed: {
    closedMarketId() {
      return Number(this.$route.params.id);
    },
  },
  mounted() {
    this.openVerifyDialog();
  },
  methods: {
    openVerifyDialog() {
      this.$refs.dialog.show({
        closedMarketId: this.closedMarketId,
      });
    },
  },
};
</script>
