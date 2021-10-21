<template>
  <div class="login-container">
    <ErrorBox v-if="error">{{ error }}</ErrorBox>
    <PageTitle>⼊⼒内容と利⽤規約の確認</PageTitle>
    <ConfirmForm @edit="onEdit" @confirm="onConfirm" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ErrorBox from "@/components/atoms/ErrorBox";
import PageTitle from "@/components/atoms/PageTitle";
import ConfirmForm from "@/components/atoms/register/activate/ConfirmForm";
import { extractFlatValidationError } from "@/plugins/vee-validate";

export default {
  components: {
    ErrorBox,
    PageTitle,
    ConfirmForm,
  },
  data() {
    return {
      error: null,
    };
  },
  computed: {
    ...mapGetters({
      memberId: "register/activate/memberId",
      email: "register/activate/email",
      password: "register/activate/password",
      formData: "register/activate/memberFormData",
    }),
  },
  methods: {
    onEdit() {
      this.$router.push("/transfer/activate");
    },
    async onConfirm() {
      try {
        await this.$api.store(`member/${this.memberId}`, this.formData);
        await this.$auth.loginWith("local", {
          data: {
            email: this.email,
            password: this.password,
            keep_login: true,
          },
        });

        this.$router.push("/transfer/activate/complete");
      } catch (error) {
        const errorMessages = extractFlatValidationError(error);
        this.error = errorMessages[0];
      }
    },
  },
};
</script>
