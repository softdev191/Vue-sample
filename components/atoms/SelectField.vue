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
    <div :class="selectWrapperClass">
      <select
        :id="id"
        v-model="innerValue"
        :class="[selectClass, touched && invalid ? 'error' : '']"
        :disabled="disabled"
      >
        <option v-if="useUnselectOption" :value="unselectOption.id">
          {{ unselectOption.name }}
        </option>
        <option
          v-for="item in innerOptinItems"
          :key="item.id"
          :value="item.id"
          :selected="item.id === innerValue"
        >
          {{ item.name }}
        </option>
        <slot name="options" />
      </select>
    </div>
    <slot />
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
    selectWrapperClass: {
      type: String,
      default: "select-wrapper",
    },
    selectClass: {
      type: String,
      default: "form-control",
    },
    labelClass: {
      type: String,
      default: "form-label",
    },
    optionItems: {
      type: [Array],
      default: null,
    },
    useUnselectOption: {
      type: Boolean,
      default: false,
    },
    unselectOption: {
      type: Object,
      default: () => ({ name: "選択してください", id: null }),
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
    innerOptinItems() {
      return (this.optionItems || []).map((option) =>
        option && typeof option === "object"
          ? option
          : { id: option, name: option }
      );
    },
  },
};
</script>
