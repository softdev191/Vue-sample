<template>
  <div class="fixed-container">
    <ErrorBox v-if="error">{{ error }}</ErrorBox>
    <Breadcrumb text="HOME > マイページ > パスワード変更" />
    <div class="mypage-layout">
      <SideMenu />
      <div class="mypage-main">
        <PageTitle>パスワード変更</PageTitle>
        <section class="email-update-section">
          <div class="update-form">
            <ValidationObserver
              v-slot="{ valid }"
              ref="validationObserver"
              tag="div"
            >
              <Password
                id="old_password"
                v-model="oldPassword"
                class="form-group"
                :input-class="['form-control password']"
              />
              <Password
                id="password"
                v-model="password"
                class="form-group"
                label="新しいパスワード"
                :input-class="['form-control password']"
              />
              <Password
                id="password_confirmation"
                v-model="passwordConfirmation"
                class="form-group"
                label="新しいパスワード（確認用）"
                :input-class="['form-control password']"
                rules="required|min:8|password|need_alpha_num|confirmed:password"
                :info-text="false"
              />
              <div class="form-group">
                <ButtonWrapper theme="normal" class-name="mt30">
                  <Button
                    theme="dark"
                    :disabled="!valid"
                    :pending="pending"
                    @click="update"
                  >
                    パスワードを再設定する
                  </Button>
                </ButtonWrapper>
              </div>
            </ValidationObserver>
          </div>
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
import Password from "@/components/atoms/Password";
import { extractFlatValidationError } from "@/plugins/vee-validate";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";

export default {
  components: {
    ErrorBox,
    PageTitle,
    Breadcrumb,
    SideMenu,
    Password,
    ButtonWrapper,
    Button,
  },
  data() {
    return {
      oldPassword: "",
      password: "",
      passwordConfirmation: "",
      error: null,
    };
  },
  computed: {
    pending() {
      return this.$store.getters["common/pending"];
    },
  },
  methods: {
    reset() {
      this.oldPassword = "";
      this.password = "";
      this.passwordConfirmation = "";
    },
    async update() {
      try {
        this.$store.commit("common/pending", true);
        await this.$api.store(`member/${this.$auth.user.id}/change_password`, {
          password: this.oldPassword,
          new_password: this.password,
        });

        this.$router.push({
          path: "/mypage",
          query: { result: "PasswordUpdated" },
        });
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
      title: "パスワード変更",
    };
  },
};
</script>
