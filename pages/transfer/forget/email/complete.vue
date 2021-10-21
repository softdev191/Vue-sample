<template>
  <div class="fixed-container">
    <ErrorBox v-if="error">{{ error }}</ErrorBox>
    <PageTitle class="center">
      ※まだ移⾏⼿続き完了していません、<br />
      お気をつけください。<br />
      <br />
      会員システムと照合した結果、<br />
      メールアドレスの確認ができました。<br />
      <br />
      入力されたメールアドレス宛に、<br />
      認証メールを送信しました。
    </PageTitle>
    <p class="text kome mb0">
      届いたメール内に記載されているURLをクリックして、認証<br />
      手続きを完了してください
    </p>
    <p class="text kome mb20">
      受信までに数十分の時差がある場合もございます。<br />
    </p>
    <p class="fs14 fwb mb15">メールアドレス</p>
    <p class="fs14 fwb mb25">{{ email }}</p>
    <p class="text mb25">
      入力したメールアドレス宛に認証メールが届かないお客さまは、[認証メールを再送する]ボタンを押してください。
    </p>
    <div class="form-group">
      <ButtonWrapper theme="normal" class-name="mt30">
        <Button theme="light" @click="resend">
          変更確認メールを再送する
        </Button>
      </ButtonWrapper>
    </div>
    <p class="text right mb23">
      <NuxtLink to="/transfer/forget/both">
        登録メールアドレスにメールが届かない場合
        <fa :icon="faChevronRight" />
      </NuxtLink>
    </p>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PageTitle from "@/components/atoms/PageTitle";
import ErrorBox from "@/components/atoms/ErrorBox";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";
import { extractFlatValidationError } from "@/plugins/vee-validate";

export default {
  components: {
    PageTitle,
    ErrorBox,
    ButtonWrapper,
    Button,
  },
  data() {
    return {
      error: null,
      intervalId: null,
      seconds: 5,
    };
  },
  computed: {
    ...mapGetters({
      email: "transfer/forget/email/email",
      formData: "transfer/forget/email/formData",
    }),
    canResend() {
      return this.seconds <= 0;
    },
    faChevronRight() {
      return faChevronRight;
    },
  },
  mounted() {
    const _this = this;
    this.intervalId = setInterval(function () {
      if (_this.seconds > 0) {
        _this.seconds--;
      }
    }, 1000);
  },
  beforeDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
  methods: {
    async resend() {
      try {
        const response = await this.$api.store(
          "old_member/forget/mail",
          this.formData
        );

        this.$store.dispatch("transfer/forget/email/setEmail", response.email);
        this.seconds = 5;
      } catch (error) {
        const messages = extractFlatValidationError(error);
        this.error = messages[0];
      }
    },
  },
  head() {
    return {
      title:
        "旧ヤマダヤ会員(旧名:YMDYメンバーズ)に登録していたメールアドレスをお忘れの場合",
    };
  },
};
</script>

<style lang="scss" scoped>
.text {
  font-size: 12px;
  line-height: 22px;
  &.right {
    text-align: right;
  }
}
</style>
