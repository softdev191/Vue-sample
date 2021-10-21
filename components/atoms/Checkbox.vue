<template>
  <span class="checkbox">
    <input
      :id="id"
      v-model="innerValue"
      type="checkbox"
      :class="inputClass"
      :name="name"
    />
    <label v-if="text || isColorSelect" :class="labelClass" :for="id">
      {{ text }}
    </label>
  </span>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    value: {
      type: [Number, Boolean],
      default: false,
    },
    text: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: null,
    },
    inputClass: {
      type: String,
      default: "input",
    },
    labelClass: {
      type: String,
      default: "label",
    },
    isColorSelect: {
      type: Boolean,
      default: false,
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

  .input {
    display: none;
  }
  .label {
    display: block;
    padding: 10px 5px 10px 25px;
    margin: 0 5px 0 5px;
    border-bottom: solid 1px #dbdbdb;
    @include touch {
      padding: 10px 5px 10px 25px;
    }
    @include desktop {
      padding: 10px 5px 10px 18px;
    }
  }

  .label,
  .input {
    &:hover {
      cursor: pointer;
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
    top: 13.5px;
    left: 10px;
    transform: rotate(45deg);
    border-bottom: 1px solid #fff;
    border-right: 1px solid #fff;
    color: #fff;
    @include touch {
      width: 5px;
      height: 9px;
      top: 12px;
      left: 10.5px;
    }
    @include desktop {
      width: 4px;
      height: 7px;
    }
  }
}
</style>
