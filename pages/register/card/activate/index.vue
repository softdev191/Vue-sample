<template>
  <div class="login-container">
    <PageTitle>YAMADAYA会員登録手続き(会員カードと紐付け済)</PageTitle>
    <p class="fs12 mb30">
      このページで⼊⼒された情報は暗号化され、安全な状態で送信されます。
    </p>
    <CardInfo />
    <ActivateForm @confirm="onNext" />
  </div>
</template>

<script>
import PageTitle from "@/components/atoms/PageTitle";
import CardInfo from "@/components/atoms/register/activate/CardInfo";
import ActivateForm from "@/components/atoms/register/activate/ActivateForm";

export default {
  components: {
    PageTitle,
    CardInfo,
    ActivateForm,
  },
  async fetch() {
    await this.$store.dispatch("master/fetch", { useCache: true });
  },
  async mounted() {
    try {
      this.$store.commit("register/activate/loading", true);
      if (this.$route.query.member_token) {
        this.$store.dispatch(
          "register/activate/setMemberToken",
          this.$route.query.member_token
        );
      }
      if (this.$route.query.member_id) {
        this.$store.dispatch(
          "register/activate/setMemberId",
          this.$route.query.member_id
        );

        const response = await this.$api.fetch(
          `member/${this.$route.query.member_id}?member_token=${this.$store.getters["register/activate/memberToken"]}`
        );

        this.$store.dispatch("register/activate/setEmail", response.email);
        if (response.card_id) {
          this.$store.dispatch("register/activate/setCardId", response.card_id);
        }
        if (response.pin) {
          this.$store.dispatch("register/activate/setPin", response.pin);
        }
        this.$store.dispatch("register/activate/setMember", response);
      }
    } finally {
      this.$store.commit("register/activate/loading", false);
    }
  },
  methods: {
    onNext() {
      this.$router.push("/register/card/activate/confirm");
    },
  },
  head() {
    return {
      title: "YAMADAYA会員登録手続き(会員カードと紐付け済)",
    };
  },
};
</script>
