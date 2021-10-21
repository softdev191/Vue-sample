<template>
  <client-only>
    <VueDatePicker
      :id="id"
      v-model="innerValue"
      :class="className"
      :format="format"
      :language="language"
      :monday-first="true"
      :clear-button="clearButton"
      :disabled="disabled"
      :placeholder="placeholder"
      :disabled-dates="disabledDates"
      :input-class="inputClass"
    ></VueDatePicker>
  </client-only>
</template>

<script>
import VueDatePicker from "vuejs-datepicker";
import { ja as language } from "vuejs-datepicker/dist/locale";
import dayjs from "dayjs";

export default {
  components: {
    VueDatePicker,
  },
  props: {
    id: {
      type: String,
      default: null,
    },
    value: {
      type: String,
      default: null,
    },
    clearButton: {
      type: Boolean,
      default: true,
    },
    className: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    format: {
      type: String,
      default: "yyyy/MM/dd（D）",
    },
    placeholder: {
      type: String,
      default: "日付を入力",
    },
    disabledDates: {
      type: Object,
      default: null,
    },
    inputClass: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      language,
    };
  },
  computed: {
    innerValue: {
      get() {
        return !this.value ? null : dayjs(this.value).toDate();
      },
      set(newValue) {
        this.$emit(
          "input",
          newValue ? dayjs(newValue).format("YYYY-MM-DD") : null
        );
      },
    },
  },
};
</script>

<style scoped lang="scss">
.datepicker-wrapper::v-deep .vdp-datepicker > div {
  position: relative;
}
::v-deep .vdp-datepicker__clear-button {
  display: block;
  position: absolute;
  right: 2%;
  top: 12px;
}
</style>
