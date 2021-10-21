<template>
  <div class="form-wrapper">
    <form>
      <div class="form-group">
        <label class="form-label" for="card_id">
          YMDY Co.LTD MEMBERSCARD ID
        </label>
        <input
          id="card_id"
          v-model="cardId"
          class="form-control"
          type="text"
          name="card_id"
          placeholder="会員コードを⼊⼒してください"
        />
      </div>
      <div class="form-group">
        <label class="form-label" for="pin_code">PINコード</label>
        <input
          id="pin_code"
          v-model="pinCode"
          class="form-control"
          type="text"
          name="pin_code"
          placeholder="4桁のPINコードを⼊⼒してください"
          maxlength="4"
        />
      </div>
      <div class="form-group">
        <button type="button" class="btn inline mt30" @click="nextStep">
          次に進む：残り2ステップ
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  computed: {
    cardId: {
      get() {
        return this.$store.state.register.member.card.id;
      },
      set(value) {
        this.$store.commit("register/member/setCardId", value);
      },
    },
    pinCode: {
      get() {
        return this.$store.state.register.member.card.pin;
      },
      set(value) {
        this.$store.commit("register/member/setPinCode", value);
      },
    },
  },
  methods: {
    nextStep() {
      this.$emit("next");
    },
  },
};
</script>
