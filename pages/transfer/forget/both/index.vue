<template>
  <div class="fixed-container">
    <ValidationObserver v-slot="{ invalid }" ref="obs">
      <ErrorBox v-if="error">{{ error }}</ErrorBox>
      <PageTitle>
        旧ヤマダヤ会員(旧名:YMDYメンバーズ)に登録していた<br />
        メールアドレスにメールが届かない場合
      </PageTitle>
      <p class="text mb20">
        カスタマーサービスのスタッフがご本人様確認の手続きを行います。<br />
        大変お手数ですが、現在ご連絡の取れるメールアドレス・電話番号を下記に入力してください。<br />
        ※申請が混雑している場合や、ご登録状況によりましては回答までにお時間をいただく場合がございます。<br />
        あらかじめご了承下さい。<br />
      </p>
      <TextField
        id="email"
        v-model="email"
        type="email"
        name="メールアドレス"
        rules="required|email"
        label="ご連絡の取れるメールアドレス"
        placeholder="メールアドレスを入力してください"
      />
      <TextField
        id="phone"
        v-model="phone"
        type="text"
        name="電話番号"
        rules="required"
        label="ご連絡の取れる電話番号"
        placeholder="電話番号を⼊⼒してください"
      />
      <TextField
        id="member_id"
        v-model="memberId"
        type="text"
        name="会員ID"
        label="会員ID（わかる⽅のみ）"
        placeholder="会員IDを⼊⼒してください"
      />
      <div class="form-group">
        <ButtonWrapper theme="normal" class-name="mt30">
          <Button theme="dark" :disabled="invalid" @click="send">
            本人確認の申請をする
          </Button>
        </ButtonWrapper>
      </div>
    </ValidationObserver>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PageTitle from "@/components/atoms/PageTitle";
import ErrorBox from "@/components/atoms/ErrorBox";
import TextField from "@/components/atoms/TextField";
import { extractFlatValidationError } from "@/plugins/vee-validate";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";

export default {
  components: {
    PageTitle,
    ErrorBox,
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
    ...mapGetters({
      formData: "transfer/forget/both/formData",
    }),
    email: {
      get() {
        return this.$store.state.transfer.forget.both.email;
      },
      set(value) {
        this.$store.commit("transfer/forget/both/setEmail", value);
      },
    },
    phone: {
      get() {
        return this.$store.state.transfer.forget.both.phone;
      },
      set(value) {
        this.$store.commit("transfer/forget/both/setPhone", value);
      },
    },
    memberId: {
      get() {
        return this.$store.state.transfer.forget.both.memberId;
      },
      set(value) {
        this.$store.commit("transfer/forget/both/setMemberId", value);
      },
    },
    hasError() {
      return this.errors !== undefined;
    },
  },
  methods: {
    async send() {
      try {
        await this.$api.store("old_member/forget/all", this.formData);
        this.$router.push("/transfer/forget/both/complete");
      } catch (error) {
        const messages = extractFlatValidationError(error);
        this.error = messages[0];
      }
    },
  },
  head() {
    return {
      title:
        "旧ヤマダヤ会員(旧名:YMDYメンバーズ)に登録していたメールアドレスにメールが届かない場合",
    };
  },
};
</script>
