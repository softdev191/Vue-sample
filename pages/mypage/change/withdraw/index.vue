<template>
  <div class="fixed-container">
    <ErrorBox v-if="error">{{ error }}</ErrorBox>
    <Breadcrumb text="HOME > マイページ > 退会の手続き" />
    <div class="mypage-layout">
      <SideMenu />
      <div class="mypage-main">
        <PageTitle>退会の手続き</PageTitle>
        <p class="text mb30">
          退会される場合は本注意事項を十分お読みいただき、ご理解のうえ退会手続きくださいますようお願いいたします。<br /><br />
          登録情報は完全に削除いたします。<br />
          ポイントは全て無効になります。<br />
          退会後、1週間ほどメールまたはDMが届く可能性がございます。<br /><br />
          「退会理由」を選択し、「退会する」ボタンをクリックしてください。<br /><br />
        </p>
        <ValidationObserver v-slot="observer" ref="obs">
          <form>
            <ValidationProvider
              v-slot="{ dirty, invalid }"
              vid="reason"
              name="退会理由"
              rules="required|min_value:1"
              tag="div"
              class="form-group"
            >
              <label class="form-label">退会理由</label>
              <div class="select-wrapper">
                <select
                  id="reason"
                  v-model="reason"
                  class="form-control"
                  :class="[dirty && invalid ? 'error' : '']"
                >
                  <option value="0">退会理由を選んでください</option>
                  <option
                    v-for="reasonItem in withdrawReasons"
                    :key="reasonItem.key"
                    :value="reasonItem.value"
                  >
                    {{ reasonItem.label }}
                  </option>
                </select>
              </div>
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ dirty, invalid }"
              vid="agree"
              name="同意"
              :rules="{ required: { allowFalse: false } }"
              tag="div"
              class="form-group"
            >
              <input
                id="agree"
                v-model="agree"
                type="checkbox"
                name="remember"
                class="form-checkbox"
                :class="[dirty && invalid ? 'error' : '']"
              />
              <label for="agree">注意事項に同意する</label>
            </ValidationProvider>
            <div class="form-group">
              <ButtonWrapper theme="normal" class-name="mt30">
                <Button
                  theme="light"
                  :disabled="observer.invalid"
                  :pending="pending"
                  @click="withdraw"
                >
                  YAMADAYA会員を退会する
                </Button>
              </ButtonWrapper>
            </div>
          </form>
        </ValidationObserver>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ErrorBox from "@/components/atoms/ErrorBox";
import PageTitle from "@/components/atoms/PageTitle";
import Breadcrumb from "@/components/partials/Breadcrumb";
import SideMenu from "@/components/pages/mypage/SideMenu";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";
import { extractFlatValidationError } from "@/plugins/vee-validate";
import { CartCredentialProvider } from "@/plugins/storage-provider/cart-credential";

export default {
  components: {
    ErrorBox,
    PageTitle,
    Breadcrumb,
    SideMenu,
    ButtonWrapper,
    Button,
  },
  async fetch() {
    await this.$store.dispatch("master/fetch");
  },
  data() {
    return {
      agree: false,
      reason: 0,
      error: null,
    };
  },
  computed: {
    ...mapGetters({
      withdrawReasons: "master/withdrawReasons",
      pending: "common/pending",
    }),
    reasonLabel() {
      const currentReason = this.withdrawReasons.find(
        (item) => item.value === this.reason
      );
      return currentReason ? currentReason.label : "";
    },
  },
  methods: {
    async withdraw() {
      try {
        this.$store.commit("common/pending", true);
        await this.$api.update(`member/${this.$auth.user.id}/withdraw`, {
          reason: this.reason,
        });

        this.$amazonPay.logout();
        await this.$auth.logout();
        CartCredentialProvider.clear();

        // Amazon Payでログインすると$router.pushのが効かなくなるので強制的にリダイレクトさせる。
        window.location.href = "/mypage/change/withdraw/complete";
      } catch (error) {
        const errorMessages = extractFlatValidationError(error);
        this.error = errorMessages[0];
      } finally {
        this.$store.commit("common/pending", false);
      }
    },
  },
  head() {
    return {
      title: "退会の手続き",
    };
  },
};
</script>

<style lang="scss" scoped>
.text {
  font-size: 12px;
}
.text-title {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 0;
}
.link {
  color: $black;
  border-bottom: 1px solid $black;
}
.mb20 {
  margin-bottom: 20px;
}
.mb25 {
  margin-bottom: 25px;
}
.mb30 {
  margin-bottom: 30px;
}
.mb40 {
  margin-bottom: 40px;
}
</style>
