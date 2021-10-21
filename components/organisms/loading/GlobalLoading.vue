<template>
  <transition name="loading">
    <div v-show="loading">
      <Orverlay />
      <Loading :type="TYPE_INDICATOR" class="loading" :size="8" :show="true" />
    </div>
  </transition>
</template>

<script>
import Orverlay from "@/components/atoms/Overlay";
import Loading, {
  TYPE_INDICATOR,
} from "@/components/molecules/loading/Loading";

export default {
  name: "GlobalLoading",
  components: {
    Orverlay,
    Loading,
  },
  data() {
    return {
      TYPE_INDICATOR,
    };
  },
  computed: {
    loading() {
      return this.$store.getters["common/loading"];
    },
  },
};
</script>

<style lang="scss" scoped>
.loading {
  position: fixed;
  top: 46%;
  right: 0;
  left: 0;
  margin-bottom: unset !important;
  margin-top: unset !important;
  z-index: 10001;
  opacity: 0.8;
}
.loading-enter-active {
  transition: all 0.6s;
}
.loading-leave-active {
  transition: all 0.6s;
}
.loading-enter,
.loading-leave-to {
  opacity: 0;
}
</style>
