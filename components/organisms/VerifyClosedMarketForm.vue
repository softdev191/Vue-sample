<template>
  <ValidationObserver
    v-slot="observerProps"
    ref="observer"
    class="v-form-wrapper"
    tag="form"
  >
    <div class="form-group">
      <ValidationProvider
        v-slot="{ dirty, invalid, errors }"
        vid="password"
        name="パスワード"
        :rules="{
          required: true,
          max: 255,
        }"
        tag="div"
      >
        <label class="form-label required" for="password">パスワード</label>
        <div class="form-control-wrapper">
          <input
            id="password"
            v-model="inputPassword"
            class="form-control"
            :class="[dirty && invalid ? 'error' : '']"
            type="text"
            name="password"
          />
        </div>
        <div v-if="errors[0]" class="error error-msg">{{ errors[0] }}</div>
        <div v-if="errorMessage" class="error error-msg">
          {{ errorMessage }}
        </div>
      </ValidationProvider>
    </div>
    <div class="submit-wrapper">
      <Button
        :disabled="observerProps.invalid"
        :theme="THEME_DARK"
        @click.prevent="observerProps.handleSubmit(handleSendRequest)"
        >ログイン</Button
      >
    </div>
  </ValidationObserver>
</template>

<script>
import Button, { THEME_DARK } from "@/components/atoms/Button";

export default {
  name: "VerifyClosedMarketForm",
  components: {
    Button,
  },
  props: {
    closedMarketId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      THEME_DARK,
      inputPassword: "",
      errorMessage: "",
      pending: false,
    };
  },
  methods: {
    async handleSendRequest() {
      if (this.pending) {
        return;
      }

      try {
        this.pending = true;
        this.errorMessage = "";
        const password = this.inputPassword;
        const id = this.closedMarketId;

        await this.$api.store(`closed_markets/${id}/verify`, {
          password,
        });

        this.$emit("verified");
      } catch (error) {
        console.error(error);

        if (error.status === 401 || error.status === 403) {
          this.errorMessage = "パスワードが間違っています。";
        } else {
          this.errorMessage = "送信に失敗しました。";
        }
      } finally {
        this.pending = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.v-form-wrapper {
  margin: 10px;

  @include desktop {
    margin: 10px 64px;
  }

  .form-control-wrapper {
    width: 100%;
    .form-control {
      width: calc(100% - 30px);
    }
    span {
      margin-left: 2px;
      display: inline-block;
    }
  }

  .submit-wrapper {
    margin-top: 22px;
    &::v-deep {
      .wrap {
        .button {
          max-width: 228px;
        }
      }
    }

    @include desktop {
      padding-bottom: 38px;
    }
  }
}
</style>
