<template>
  <div class="fixed-container">
    <ValidationObserver v-slot="{ invalid }" ref="obs">
      <ErrorBox v-if="error">{{ error }}</ErrorBox>
      <PageTitle>
        旧ヤマダヤ会員(旧名:YMDYメンバーズ)に登録していた<br />
        メールアドレスをお忘れの場合
      </PageTitle>
      <p class="text mb20">
        会員システムから、登録されているメールアドレスをお探し致します。お手数ですが、下記情報をすべて入力してください。
      </p>
      <div class="form-group-wrapper col-2">
        <TextField
          id="last_name"
          v-model="lastName"
          type="text"
          name="氏"
          rules="required"
          label="氏"
        />
        <TextField
          id="first_name"
          v-model="firstName"
          type="text"
          name="名"
          rules="required"
          label="名"
        />
      </div>
      <div class="form-group">
        <label class="form-label" for="birthday">⽣年⽉⽇</label>
        <DateSelect id="birthday" v-model="birthday" />
      </div>
      <TextField
        id="phone"
        v-model="phone"
        type="text"
        name="電話番号"
        rules="required"
        label="電話番号"
        placeholder="電話番号を⼊⼒してください"
      />
      <p class="text mb25">
        入力されたすべての情報が会員システムと完全に一致した場合に、登録されていたメールアドレス宛に、認証メールを送信します。届いたメール内に記載されているURLをクリックして、メールアドレス認証手続きを完了してください。
      </p>
      <p class="text right mb23">
        <NuxtLink to="/transfer/forget/both">
          登録していた情報を忘れてしまった場合
          <fa :icon="faChevronRight" />
        </NuxtLink>
      </p>
      <div class="form-group">
        <ButtonWrapper theme="normal">
          <Button theme="dark" :disabled="invalid" @click="send">
            照合する
          </Button>
        </ButtonWrapper>
      </div>
    </ValidationObserver>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PageTitle from "@/components/atoms/PageTitle";
import DateSelect from "@/components/atoms/DateSelect";
import ErrorBox from "@/components/atoms/ErrorBox";
import TextField from "@/components/atoms/TextField";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";
import { extractFlatValidationError } from "@/plugins/vee-validate";

export default {
  components: {
    PageTitle,
    ErrorBox,
    DateSelect,
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
      formData: "transfer/forget/email/formData",
    }),
    lastName: {
      get() {
        return this.$store.state.transfer.forget.email.lastName;
      },
      set(value) {
        this.$store.commit("transfer/forget/email/setLastName", value);
      },
    },
    firstName: {
      get() {
        return this.$store.state.transfer.forget.email.firstName;
      },
      set(value) {
        this.$store.commit("transfer/forget/email/setFirstName", value);
      },
    },
    birthday: {
      get() {
        return this.$store.state.transfer.forget.email.birthday;
      },
      set(value) {
        this.$store.commit("transfer/forget/email/setBirthday", value);
      },
    },
    phone: {
      get() {
        return this.$store.state.transfer.forget.email.phone;
      },
      set(value) {
        this.$store.commit("transfer/forget/email/setPhone", value);
      },
    },
    faChevronRight() {
      return faChevronRight;
    },
  },
  methods: {
    async send() {
      try {
        const response = await this.$api.store(
          "old_member/forget/mail",
          this.formData
        );

        this.$store.dispatch("transfer/forget/email/setEmail", response.email);
        this.$router.push("/transfer/forget/email/complete");
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
