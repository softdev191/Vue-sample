<template>
  <div v-if="cardId" class="form-wrapper">
    <div class="form-group">
      <label class="form-label">YMDY Co.LTD MEMBERSCARD ID</label>
      <label class="form-label">{{ cardId }}</label>
    </div>
    <div class="form-group">
      <label class="form-label">PINコード</label>
      <label class="form-label">{{ pin }}</label>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      cardId: "register/activate/cardId",
      pin: "register/activate/pin",
    }),
  },
};
</script>
