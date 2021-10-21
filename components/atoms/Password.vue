<template>
  <ValidationProvider
    v-slot="{ touched, invalid, errors, failedRules }"
    :vid="id"
    :rules="rules"
    tag="div"
    :name="label"
  >
    <label :class="labelClass" :for="id">{{ label }}</label>
    <div class="password-wrapper">
      <input
        :id="id"
        :ref="id"
        v-model="password"
        :class="inputClass + (touched && invalid ? ' error' : '')"
        :type="passwordFieldType"
        :name="id"
        :placeholder="placeholder"
        @input="updatePassword"
      />
      <span :class="eyeClass" @click="switchPasswordVisibility">
        {{ passwordFieldType === "password" ? showText : hideText }}
      </span>
    </div>
    <p v-if="infoText" :class="infoClass" v-html="infoText" />
    <error-message
      v-for="(message, key) in combineErrors(errors, failedRules)"
      :key="key"
      >{{ message }}</error-message
    >
  </ValidationProvider>
</template>

<script>
import ErrorMessage from "@/components/atoms/form/ErrorMessage";
import formFieldMixin from "@/components/molecules/form/mixins/formFieldMixin";

export default {
  components: {
    ErrorMessage,
  },
  mixins: [formFieldMixin],
  props: {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: "パスワード",
    },
    placeholder: {
      type: String,
      default: "パスワードを入力してください",
    },
    rules: {
      type: String,
      default: "required|password|need_alpha_num|min:8",
    },
    showText: {
      type: String,
      default: "見る",
    },
    hideText: {
      type: String,
      default: "非表示にする",
    },
    infoText: {
      type: [String, Boolean],
      default:
        "※半角小文字アルファベットと半角数字がそれぞれ１つ以上必要です。<br />※8文字以上、半角・小文字・記号のみ入力可能です。",
    },
    labelClass: {
      type: [String, Array],
      default: "form-label",
    },
    inputClass: {
      type: [String, Array],
      default: "form-control password",
    },
    eyeClass: {
      type: [String, Array],
      default: "eye",
    },
    infoClass: {
      type: [String, Array],
      default: "form-control-info",
    },
  },
  data() {
    return {
      passwordFieldType: "password",
      password: this.value,
    };
  },
  methods: {
    switchPasswordVisibility() {
      this.passwordFieldType =
        this.passwordFieldType === "password" ? "text" : "password";
    },
    updatePassword() {
      this.$emit("input", this.password);
    },
  },
};
</script>

<style lang="scss" scoped>
.form-control {
  &.password {
    max-width: 400px;
    @include touch {
      width: calc(100% - 73px);
    }
  }
}
.eye {
  color: $black;
  font-size: 10px;
  text-decoration: underline;
  margin-left: 13px;
  cursor: pointer;
}
.password-wrapper {
  display: flex;
  align-items: center;
  input {
    flex: 1;
  }
  span {
    display: inline-block;
    width: 60px;
  }
}
</style>
