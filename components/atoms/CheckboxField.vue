<template>
  <ValidationProvider
    v-slot="{ touched, invalid, errors, failedRules }"
    :vid="computedVid"
    :name="validateName"
    :rules="rules"
    :class="wrapperClass"
    :tag="wrapperTag"
  >
    <input
      :id="id"
      v-model="innerValue"
      type="checkbox"
      :class="inputClass"
      :name="name"
      :disabled="disabled"
    />
    <label v-if="label" :class="labelClass" :for="id">{{ label }}</label>
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
  name: "CheckboxField",
  components: {
    ErrorMessage,
  },
  mixins: [formFieldMixin],
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
    value: {
      type: [Boolean, Number],
      default: 0,
    },
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
      default: "form-checkbox",
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
};
</script>

<style lang="scss" scoped>
.text-info {
  font-size: 10px;
}
</style>
