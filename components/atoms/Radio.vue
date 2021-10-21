<template>
  <span class="checkbox">
    <input
      :id="id || optionValue"
      v-model="innerValue"
      :value="optionValue"
      class="input"
      :name="name"
      type="radio"
    />
    <label class="label" :for="id || optionValue">{{ text }}</label>
  </span>
</template>

<script>
export default {
  props: {
    optionValue: {
      type: [String, Number, Boolean],
      default: null,
    },
    text: {
      type: String,
      default: "",
    },
    id: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    value: {
      type: [String, Number, Boolean],
      default: null,
    },
  },
  computed: {
    innerValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.checkbox {
  position: relative;
  display: block;
  width: 100%;

  .input {
    display: none;
  }
  .label {
    display: block;
    padding: 10px 5px 10px 25px;
    margin: 0 5px 0 5px;
    @include touch {
      padding: 10px 5px 10px 25px;
    }
    @include desktop {
      padding: 10px 5px 10px 18px;
    }
  }
  .label::before {
    content: "";
    display: block;
    position: absolute;
    border: 1px solid #000;
    border-radius: 50%;

    @include touch {
      top: 10px;
      left: 5px;
      width: 16px;
      height: 16px;
    }
    @include desktop {
      top: 12px;
      left: 6px;
      width: 12px;
      height: 12px;
    }
  }
  .input:checked + label::before {
    content: "";
    background-color: #000;
  }
  .input:checked + label::after {
    content: "";
    display: block;
    position: absolute;
    top: 13px;
    left: 10px;
    transform: rotate(45deg);
    border-bottom: 1px solid #fff;
    border-right: 1px solid #fff;
    color: #fff;
    @include touch {
      width: 5px;
      height: 9px;
    }
    @include desktop {
      width: 4px;
      height: 7px;
    }
  }
}
</style>
