<template>
  <div class="fixed-container">
    <ErrorBox v-if="error">{{ error }}</ErrorBox>
    <Breadcrumb text="HOME > マイページ > メールアドレス変更" />
    <div class="mypage-layout">
      <SideMenu />
      <div class="mypage-main">
        <PageTitle>メールアドレス変更</PageTitle>
        <section class="email-update-section">
          <div class="form-group">
            <label class="form-label">現在のメールアドレス</label>
            <label class="form-label">{{ $auth.user.email }}</label>
          </div>
        </section>
        <section class="email-update-section">
          <ValidationObserver
            v-slot="observer"
            ref="validationObserver"
            tag="div"
            class="update-form"
          >
            <TextField
              id="email"
              vid="email"
              v-model="email"
              type="email"
              name="メール"
              rules="required|email"
              label="新しいメールアドレス"
              placeholder="利用するメールアドレスを入力してください"
            />
            <TextField
              id="email_confirmation"
              v-model="emailConfirmation"
              type="email"
              name="メール確認"
              rules="required|email|confirmed:email"
              label="新しいメールアドレス（確認用）"
              placeholder="利用するメールアドレスを入力してください"
            />
            <div class="form-group">
              <ButtonWrapper theme="normal">
                <Button
                  theme="dark"
                  :disabled="observer.invalid"
                  :pending="pending"
                  @click="update"
                >
                  変更確認メールを送る
                </Button>
              </ButtonWrapper>
            </div>
          </ValidationObserver>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import ErrorBox from "@/components/atoms/ErrorBox";
import PageTitle from "@/components/atoms/PageTitle";
import Breadcrumb from "@/components/partials/Breadcrumb";
import SideMenu from "@/components/pages/mypage/SideMenu";
import TextField from "@/components/atoms/TextField";
import { extractFlatValidationError } from "@/plugins/vee-validate";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";

export default {
  components: {
    ErrorBox,
    PageTitle,
    Breadcrumb,
    SideMenu,
    TextField,
    ButtonWrapper,
    Button,
  },
  data() {
    return {
      error: null,
    };
  },
  computed: {
    email: {
      get() {
        return this.$store.state.member.email.email;
      },
      set(value) {
        return this.$store.commit("member/email/setEmail", value);
      },
    },
    emailConfirmation: {
      get() {
        return this.$store.state.member.email.emailConfirm;
      },
      set(value) {
        return this.$store.commit("member/email/setEmailConfirm", value);
      },
    },
    pending() {
      return this.$store.getters["common/pending"];
    },
  },
  methods: {
    async update() {
      try {
        this.$store.commit("common/pending", true);
        await this.$api.store(`member/${this.$auth.user.id}/change_email`, {
          email: this.email,
          email_confirmation: this.emailConfirmation,
        });

        await this.$auth.fetchUser();
        this.$router.push("/mypage/change/email/send");
      } catch (error) {
        const messages = extractFlatValidationError(error);
        this.error = messages[0];
      } finally {
        this.$store.commit("common/pending", false);
      }
    },
  },
  head() {
    return {
      title: "メールアドレス変更",
    };
  },
};
</script>
