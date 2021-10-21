import { ValidationObserver as BaseValidationObserver } from "vee-validate";

export default {
  extends: BaseValidationObserver,
  watch: {
    flags(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.$emit("update:flags", newValue);
      }
    },
  },
};
