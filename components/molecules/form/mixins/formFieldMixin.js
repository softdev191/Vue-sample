/**
 * フォームバリデーションとインプット要素の組み合わせで使用するmixin
 */
export default {
  props: {
    value: {
      default: null,
    },
    name: {
      type: String,
      default: "",
    },
    id: {
      type: String,
      default: undefined,
    },
    inputClass: {
      type: String,
      default: "",
    },
    wrapperClass: {
      type: String,
      default: "",
    },
    wrapperTag: {
      type: String,
      default: "div",
    },
    inputFieldClass: {
      type: String,
      default: "input-field",
    },
    vid: {
      type: [String, Number],
      default: null,
    },
    rules: {
      type: [String, Object],
      default: "",
    },
    validName: {
      type: String,
      default: undefined,
    },
    disabled: {
      type: [Boolean, Number],
      default: false,
    },
    label: {
      type: String,
      default: "",
    },
    labelClass: {
      type: String,
      default: "",
    },
    errorMessages: {
      type: Array,
      default: () => [],
    },
    replaceMessages: {
      type: Object,
      default: () => ({}),
    },
    hideUntouchedError: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    validateName() {
      return this.validName ?? this.label;
    },
    computedVid() {
      return this.vid ?? this.name;
    },
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
  watch: {
    errorMessages(messges) {
      setTimeout(() => {
        this.setErrorsToProvider(messges);
      }, 50);
    },
  },
  methods: {
    /**
     * バリデーション結果を表示するインプット要素のclass名を返却する。
     * validation-providerのv-slotのパラメータを引数に受け取る。
     *
     * @param {Array} errors
     * @param {Boolean} validated
     */
    getValidateCss(errors, validated) {
      if (!validated) {
        return "";
      }

      return errors.length ? "validate invalid" : "validate valid";
    },

    setErrorsToProvider(messages, retry = 0) {
      if (retry > 5) {
        return;
      }

      if (!this.$refs.provider) {
        setTimeout(() => this.setErrorsToProvider(messages, ++retry), 50);
        return;
      }

      this.$refs.provider.setErrors(messages);
    },

    isDirty() {
      return this.$refs.provider.flags.dirty;
    },

    hasRule(name) {
      return (typeof this.rules === "string"
        ? this.rules
        : Object.keys(this.rules)
      ).includes(name);
    },

    /**
     * ルールの特定できるメッセージとそれ以外のメッセージをまとめる。
     * `replaceMessages`に含まれている場合、メッセージを置き換える。
     *
     * @param {string[]} errors
     * @param {Object} failedRules
     */
    combineErrors(errors, failedRules = {}) {
      const replaceMessages = this.replaceMessages;

      const dict = Object.keys(failedRules).reduce((dict, rule) => {
        return { ...dict, [failedRules[rule]]: rule };
      }, {});

      return errors
        .filter((message) => !dict[message])
        .concat(
          Object.keys(dict).map((message) =>
            replaceMessages[dict[message]]
              ? replaceMessages[dict[message]]
              : message
          )
        );
    },
  },
  mounted() {
    if (this.errorMessages.length > 0) {
      setTimeout(() => {
        this.setErrorsToProvider(this.errorMessages);
      }, 500);
    }
  },
};
