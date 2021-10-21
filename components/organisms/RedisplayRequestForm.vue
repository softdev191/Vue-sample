<template>
  <ValidationObserver
    v-slot="observerProps"
    ref="observer"
    class="re-form-wrapper"
    tag="div"
  >
    <p class="re-desc">
      再入荷のリクエストを送ることができます。再入荷時はメールでお知らせします。<br />
      ※再入荷が無い場合もございます。<br />
      ※再入荷後、直ぐに売れ切れる場合もございます。
    </p>
    <div class="columns is-mobile re-header">
      <div class="column is-2">
        <ItemImage :item-image="itemDetail.item_image" size="s" />
      </div>
      <div class="column is-10">
        <div v-if="item.brand" class="re-header--brand">
          {{ item.brand.name }}
        </div>
        <div class="re-header--name">{{ item.display_name }}</div>
        <div class="re-header--sku">
          カラー:
          {{ `${itemDetail.color_id} ${itemDetail.color.display_name}` }}
        </div>
      </div>
    </div>
    <form
      class="form-group-wrapper"
      @submit="observerProps.handleSubmit(handleSendRequest)"
    >
      <div class="form-group">
        <ValidationProvider
          v-slot="{ dirty, invalid, errors }"
          vid="user_name"
          name="お名前"
          rules="required|max:255"
        >
          <label class="form-label required" for="user_name">お名前</label>
          <input
            id="user_name"
            v-model="inputs.user_name"
            class="form-control"
            :class="[dirty && invalid ? 'error' : '']"
            type="text"
            name="user_name"
          />
          <div class="error error-msg">{{ errors[0] }}</div>
        </ValidationProvider>
      </div>
      <div class="form-group">
        <ValidationProvider
          v-slot="{ dirty, invalid, errors }"
          ref="emailProvider"
          vid="email"
          name="メールアドレス"
          :rules="{
            required: true,
            max: 255,
            email: true,
            remote: emailValidator,
          }"
          tag="div"
        >
          <label class="form-label required" for="email"
            >再入荷時のお知らせ先メールアドレス</label
          >
          <div class="form-control-wrapper">
            <input
              id="email"
              v-model="inputs.email"
              class="form-control"
              :class="[dirty && invalid ? 'error' : '']"
              type="text"
              name="email"
            />
          </div>
          <div class="error error-msg">{{ errors[0] }}</div>
        </ValidationProvider>
      </div>
      <div class="form-group">
        <ValidationProvider
          v-slot="{ dirty, invalid, errors }"
          vid="email_confirmation"
          name="メールアドレス確認"
          rules="required|max:255|confirmed:email"
          tag="div"
        >
          <div class="form-control-wrapper">
            <input
              id="email_confirmation"
              v-model="inputs.email_confirmation"
              class="form-control"
              :class="[dirty && invalid ? 'error' : '']"
              type="text"
              name="email_confirmation"
            />
            <span class="confirm-text">確認</span>
          </div>
          <div class="error error-msg">{{ errors[0] }}</div>
        </ValidationProvider>
      </div>
    </form>
    <div class="required-mrk">は必須項目です</div>
    <ButtonWrapper class-name="mt24">
      <Button
        :disabled="observerProps.invalid"
        :theme="submitButtonTheme"
        @click="observerProps.handleSubmit(handleSendRequest)"
        >リクエストを送る</Button
      >
    </ButtonWrapper>
  </ValidationObserver>
</template>

<script>
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button, { THEME_LIGHT, THEME_DARK } from "@/components/atoms/Button";
import { extractValidationError } from "@/plugins/vee-validate";
import ItemImage from "@/components/atoms/ItemImage";

export default {
  components: {
    Button,
    ButtonWrapper,
    ItemImage,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    itemDetail: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      inputs: {
        user_name: this.$auth.user
          ? `${this.$auth.user.lname}${this.$auth.user.fname}`
          : "",
        email: this.$auth.user ? this.$auth.user.email : "",
        email_confirmation: "",
      },
      emailValidator: () => this.validateEmailWithRemote(),
    };
  },
  computed: {
    submitButtonTheme() {
      return this.$device.isDesktop ? THEME_DARK : THEME_LIGHT;
    },
  },
  methods: {
    async handleSendRequest() {
      try {
        const params = {
          ...this.inputs,
          item_detail_id: this.itemDetail.id,
        };
        await this.$store.dispatch("redisplayRequest/create", { params });
        this.$emit("saved");
      } catch (error) {
        console.error(error);
        this.$refs.observer.setErrors(extractValidationError(error));
      }
    },

    async validateEmailWithRemote() {
      try {
        const { email } = this.inputs;

        if (!email) {
          return;
        }

        await this.$api.store("item_detail_redisplay_requests/validate_email", {
          email,
          item_detail_id: this.itemDetail.id,
        });

        return true;
      } catch (error) {
        const messages = extractValidationError(error);

        if (messages.email) {
          return Array.isArray(messages.email)
            ? messages.email[0]
            : messages.email;
        }

        console.error(error);

        return true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.re-form-wrapper {
  margin: 10px;

  @include desktop {
    margin: 10px 64px;
  }

  .re-desc {
    margin-bottom: 12px;
  }

  .re-header--name {
    font-size: 18px;
    @include desktop {
      margin-top: 4px;
    }
  }
  .re-header--sku {
    @include desktop {
      margin-top: 4px;
    }
  }

  .form-group-wrapper {
    padding: 18px 0;
    border-top: 1px solid #dbdbdb;
    border-bottom: 1px solid #dbdbdb;
    .form-control-wrapper {
      width: 100%;
      .form-control {
        width: calc(100% - 30px);
      }
      span {
        margin-left: 2px;
        display: inline-block;
        &.confirm-text {
          color: $dim-gray;
          font-size: 10px;
        }
      }
    }
  }

  .required-mrk {
    color: #b23838;
    margin-top: 16px;
  }
}
</style>
