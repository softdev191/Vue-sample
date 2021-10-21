<template>
  <OrderSection title="3. お届け先" class="bg">
    <div v-show="!canSpecify">お客様情報に記載された住所</div>
    <OrderAddressForm v-show="canSpecify" v-model="destinationId" />
  </OrderSection>
</template>

<script>
import { mapGetters } from "vuex";
import OrderSection from "@/components/pages/order/OrderSection";
import OrderAddressForm from "@/components/pages/order/OrderAddressForm";

export default {
  components: {
    OrderAddressForm,
    OrderSection,
  },
  props: {
    value: {
      type: Number,
      default: null,
    },
    canSpecify: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      error: null,
      newAddress: {},
      editAddress: {},
    };
  },
  computed: {
    ...mapGetters({
      destinations: "destination/destinations",
      prefs: "master/prefs",
      prefIdStrings: "master/prefIdStrings",
      user: "user",
    }),
    destinationId: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
};
</script>
