<template>
  <div class="date-select-wrapper">
    <div class="date-select">
      <div class="date-select-left">
        <ValidationProvider
          v-slot="{ touched, invalid, errors, failedRules }"
          :vid="yearId"
          name="年"
          :rules="rules"
          tag="div"
          class="select-wrapper year-select"
        >
          <select
            :id="yearId"
            v-model="myYear"
            :class="[
              yearClass,
              'form-control form-select',
              touched && invalid ? 'error' : '',
            ]"
            @change="updateDate"
            :disabled="disabled"
          >
            <option value="0">西暦</option>
            <template v-for="yearOption in yearOptions">
              <option :key="yearOption" :value="yearOption">
                {{ yearOption }}
              </option>
            </template>
          </select>
          <error-message
            v-for="(message, key) in combineErrors(errors, failedRules)"
            :key="key"
            >{{ message }}</error-message
          >
        </ValidationProvider>
      </div>
      <div class="date-select-right">
        <ValidationProvider
          v-slot="{ touched, invalid, errors, failedRules }"
          :vid="monthId"
          name="月"
          rules="required|between:1,12"
          tag="div"
          class="select-wrapper month-select"
        >
          <select
            :id="monthId"
            v-model="myMonth"
            :class="[
              monthClass,
              'form-control form-select',
              touched && invalid ? 'error' : '',
            ]"
            @change="updateDate"
            :disabled="disabled"
          >
            <option value="0">月</option>
            <template v-for="monthOption in monthOptions">
              <option :key="monthOption" :value="monthOption">
                {{ monthOption }}
              </option>
            </template>
          </select>
          <error-message
            v-for="(message, key) in combineErrors(errors, failedRules)"
            :key="key"
            >{{ message }}</error-message
          >
        </ValidationProvider>
        <ValidationProvider
          v-slot="{ touched, invalid, errors, failedRules }"
          :vid="dayId"
          name="日"
          rules="required|between:1,31"
          tag="div"
          class="select-wrapper day-select"
        >
          <select
            :id="dayId"
            v-model="myDay"
            :class="[
              dayClass,
              'form-control form-select',
              touched && invalid ? 'error' : '',
            ]"
            @change="updateDate"
            :disabled="disabled"
          >
            <option value="0">日</option>
            <template v-for="dayOption in dayOptions">
              <option :key="dayOption" :value="dayOption">
                {{ dayOption }}
              </option>
            </template>
          </select>
          <error-message
            v-for="(message, key) in combineErrors(errors, failedRules)"
            :key="key"
            >{{ message }}</error-message
          >
        </ValidationProvider>
      </div>
    </div>
    <p v-if="infoText" :class="infoClass" v-html="infoText" />
  </div>
</template>

<script>
import dayjs from "dayjs";
import ErrorMessage from "@/components/atoms/form/ErrorMessage";
import formFieldMixin from "@/components/molecules/form/mixins/formFieldMixin";

export default {
  components: {
    ErrorMessage,
  },
  mixins: [formFieldMixin],
  props: {
    yearClass: {
      type: [String, Array],
      default: "",
    },
    monthClass: {
      type: [String, Array],
      default: "",
    },
    dayClass: {
      type: [String, Array],
      default: "",
    },
    format: {
      type: String,
      default: "YYYY-MM-DD",
    },
    rules: {
      type: String,
      default: "required|min_value:1900",
    },
    infoText: {
      type: [String, Boolean],
      default: "",
    },
    infoClass: {
      type: [String, Array],
      default: "form-text",
    },
  },
  data() {
    return {
      myYear: dayjs(this.value).isValid()
        ? dayjs(this.value).format("YYYY")
        : 0,
      myMonth: dayjs(this.value).isValid() ? dayjs(this.value).format("M") : 0,
      myDay: dayjs(this.value).isValid() ? dayjs(this.value).format("D") : 0,
    };
  },
  computed: {
    yearId() {
      return this.id + "-year";
    },
    monthId() {
      return this.id + "-month";
    },
    dayId() {
      return this.id + "-day";
    },
    yearOptions() {
      const currentYear = new Date().getFullYear();
      const years = [];
      for (let i = currentYear; i >= 1900; i--) {
        years.push(i);
      }

      return years;
    },
    monthOptions() {
      const months = [];

      for (let i = 1; i <= 12; i++) {
        months.push(i);
      }

      return months;
    },
    dayOptions() {
      const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      const dayOptions = [];
      let dayCounts = 31;

      if (this.month !== undefined && this.month > 0) {
        dayCounts = days[this.month - 1];
      }

      for (let i = 1; i <= dayCounts; i++) {
        dayOptions.push(i);
      }

      return dayOptions;
    },
    currentDate() {
      if (this.myYear && this.myMonth && this.myDay) {
        return new Date(this.myYear, this.myMonth - 1, this.myDay);
      }

      return null;
    },
  },
  methods: {
    updateDate() {
      if (this.currentDate) {
        this.$emit("input", dayjs(this.currentDate).format(this.format));
      } else {
        this.$emit("input", null);
      }
    },
  },
  watch: {
    value(newVal) {
      this.myYear = dayjs(newVal).isValid() ? dayjs(newVal).format("YYYY") : 0;
      this.myMonth = dayjs(newVal).isValid() ? dayjs(newVal).format("M") : 0;
      this.myDay = dayjs(newVal).isValid() ? dayjs(newVal).format("D") : 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.date-select {
  display: flex;
  > .date-select-left {
    flex: 1;
    margin-right: 10px;
  }
  > .date-select-right {
    flex: 1;
    display: flex;
  }
  .select-wrapper {
    position: relative;
    &::after {
      content: "";
      position: absolute;
      width: 9px;
      height: 9px;
      top: 15px;
      right: 12px;
      border-left: 1px solid $black;
      border-bottom: 1px solid $black;
      transform: rotate(-45deg);
      display: block;
    }
    &.year-select {
      flex: 2;
    }
    &.month-select {
      flex: 1;
      margin-right: 10px;
    }
    &.day-select {
      flex: 1;
    }
    > select {
      -webkit-appearance: none;
    }
  }
}
</style>
