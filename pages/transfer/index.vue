<template>
  <div class="fixed-container">
    <ErrorBox v-if="error">{{ error }}</ErrorBox>
    <ErrorBox v-if="lastErrorMessage" :title="lastErrorTitle">
      {{ lastErrorMessage }}
    </ErrorBox>
    <PageTitle>新YAMADAYA会員移⾏⼿続きについて</PageTitle>
    <p class="text mb28">
      このページで入力された情報は暗号化され、安全な状態で送信されます。
    </p>
    <p class="text mb23">
      YAMADAYAアプリ(旧名:YMDY&nbsp;MEMBERSアプリ)は、YAMADAYAオンラインストアリニューアルに伴って、新YAMADAYAアプリへと生まれ変わりました。<br />
      会員様は、以前のヤマダヤ会員(旧名:YMDYメンバーズ)から、新ヤマダヤ会員への移行手続きが必要になります。<br />
      会員様には大変お手数をお掛けして申し訳ございませんが、何卒よろしくお願い致します。
    </p>
    <p class="text mb23">
      以前の会員情報との照合を行うので、旧ヤマダヤ会員(旧名:YMDYメンバーズ)に登録していたメールアドレスを入力してください。<br />
      ※事前登録キャンペーンに登録済みの会員様も、こちらから移行手続きをお願い致します。
    </p>
    <ValidationObserver v-slot="{ invalid }" ref="obs">
      <TextField
        id="email"
        v-model="email"
        type="email"
        name="メールアドレス"
        rules="required|email"
        label="登録していたメールアドレス"
        placeholder="メールアドレスを入力してください"
      />
      <p class="text right mt30 mb16">
        <NuxtLink to="/transfer/forget/email">
          登録していたメールアドレスを忘れてしまった場合
          <fa :icon="faChevronRight" />
        </NuxtLink>
      </p>
      <p class="text right mb36">
        <NuxtLink to="/transfer/forget/both">
          メールアドレスにメールが届かない場合
          <fa :icon="faChevronRight" />
        </NuxtLink>
      </p>
      <div class="form-group">
        <Button theme="dark" :disabled="invalid" @click="sendEmail">
          移行手続きに進む
        </Button>
      </div>
    </ValidationObserver>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ErrorBox from "@/components/atoms/ErrorBox";
import PageTitle from "@/components/atoms/PageTitle";
import TextField from "@/components/atoms/TextField";
import Button from "@/components/atoms/Button";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { extractFlatValidationError } from "@/plugins/vee-validate";
import { CONFLICT } from "@/constants/httpStatusCode";

export default {
  components: {
    ErrorBox,
    PageTitle,
    TextField,
    Button,
  },
  data() {
    return {
      error: null,
    };
  },
  computed: {
    ...mapGetters({
      formData: "transfer/formData",
    }),
    email: {
      get() {
        return this.$store.state.transfer.email;
      },
      set(value) {
        return this.$store.commit("transfer/setEmail", value);
      },
    },
    faChevronRight() {
      return faChevronRight;
    },
    lastError() {
      return this.$store.getters.sessionData.lastError || {};
    },
    lastErrorMessage() {
      return this.lastError.message || "";
    },
    lastErrorTitle() {
      return this.lastError.title || "エラーが発生しました。";
    },
  },
  methods: {
    async sendEmail() {
      try {
        await this.$api.store("old_member/send_email", this.formData);
        this.$router.push("/transfer/complete");
      } catch (error) {
        const messages = extractFlatValidationError(error);

        if (error.response.status === CONFLICT) {
          this.$store.commit("setSessionData", {
            lastError: {
              message: messages[0],
            },
          });
          this.$router.push("/login");
        } else {
          this.error = messages[0];
        }
      }
    },
  },
  head() {
    return {
      title: "新ヤマダヤ会員移⾏⼿続きについて",
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
  &.kome {
    position: relative;
    padding-left: 1rem;
    &::before {
      content: "※";
      position: absolute;
      left: 0;
    }
  }
}
</style>
