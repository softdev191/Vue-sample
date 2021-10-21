<template>
  <ValidationProvider
    v-slot="{ touched, invalid, errors, failedRules }"
    :vid="computedVid"
    :name="validateName"
    :rules="rules"
    :class="wrapperClass"
    :tag="wrapperTag"
  >
    <label v-if="label" :class="labelClass" :for="id">
      {{ label }}
    </label>
    <input
      :id="id"
      v-model="innerValue"
      :name="name"
      :class="[inputClass, touched && invalid ? 'error' : '']"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
    />
    <slot />
    <p v-if="infoText" class="text-info" v-html="infoText" />
    <template v-if="!hideUntouchedError || (touched && invalid)">
      <error-message
        v-for="(message, key) in combineErrors(errors, failedRules)"
        :key="key"
        >{{ message }}</error-message
      >
    </template>
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
    type: {
      type: String,
      default: "text",
    },
    wrapperClass: {
      type: String,
      default: "form-group",
    },
    inputClass: {
      type: String,
      default: "form-control",
    },
    placeholder: {
      type: String,
      default: "",
    },
    labelClass: {
      type: String,
      default: "form-label",
    },
    infoText: {
      type: [String, Boolean],
      default: false,
    },
  },
  computed: {
    innerValue: {
      set(value) {
        if (value !== this.value) {
          this.$emit("input", value);
        }
      },
      get() {
        return this.value;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.text-info {
  font-size: 10px;
}
</style>
