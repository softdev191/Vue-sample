<template>
  <OrderSection :title="title">
    <address-table :client="client"></address-table>
    <div class="edit-row">
      <div @click="updateClient">
        編集する
        <fa :icon="faChevronRight" />
      </div>
    </div>
    <ClientDialog
      ref="dialog"
      :client="client"
      :title="`お客様情報の編集`"
      :on-update-client="onUpdateClient"
    ></ClientDialog>
  </OrderSection>
</template>

<script>
import { mapState } from "vuex";
import OrderSection from "@/components/pages/order/OrderSection";
import AddressTable from "@/components/atoms/AddressTable";
import ClientDialog from "@/components/atoms/order/ClientDialog";
import { extractFlatValidationError } from "@/plugins/vee-validate";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default {
  components: {
    AddressTable,
    OrderSection,
    ClientDialog,
  },
  props: {
    title: {
      type: String,
      default: "1. お客様情報",
    },
  },
  computed: {
    ...mapState({
      client(state, getters) {
        return getters.user;
      },
    }),
    faChevronRight() {
      return faChevronRight;
    },
  },
  methods: {
    updateClient() {
      this.$refs.dialog.show();
    },
    async onUpdateClient(client) {
      try {
        this.$store.commit("common/pending", true);
        await this.$store.dispatch("updateUser", { params: { ...client } });
      } catch (error) {
        const errorMessages = extractFlatValidationError(error);
        return {
          title: "お客様情報の編集に失敗しました。",
          message: errorMessages,
        };
      } finally {
        this.$store.commit("common/pending", false);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.edit-row {
  text-align: right;
  margin-top: 10px;
}
</style>
