<template>
  <div class="field">
    <div class="s-wrapper">
      <div class="control has-icons-right">
        <input
          v-model="innerValue"
          class="input fs10"
          type="search"
          :placeholder="placeholder"
          @keyup.enter="handleKeyupEnter"
          @keypress="handleKeyPress"
        />
      </div>
      <a
        class="icon is-right search-button"
        href=""
        @click.prevent="handleClickSearch"
      >
        <SearchIconSvg />
      </a>
    </div>
  </div>
</template>

<script>
import SearchIconSvg from "@/assets/images/icons/search-icon.svg";
export default {
  components: {
    SearchIconSvg,
  },
  props: {
    placeholder: {
      type: String,
      default: "検索",
    },
    value: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      canEmitByKeyupEnter: false,
    };
  },
  computed: {
    innerValue: {
      set(value) {
        this.$emit("input", value);
      },
      get() {
        return this.value;
      },
    },
  },
  methods: {
    handleClickSearch(event) {
      this.$emit("search", this.value, event);
    },
    handleKeyupEnter(event) {
      if (this.canEmitByKeyupEnter) {
        this.$emit("search", this.value, event);
        this.canEmitByKeyupEnter = false;
      }
    },
    handleKeyPress(event) {
      this.canEmitByKeyupEnter = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.input {
  height: 40px;
  border: solid 1px #000;
  border-radius: 0;
  font-size: 16px;
}
input::-webkit-input-placeholder {
  font-size: 10px;
}
input:-moz-placeholder {
  font-size: 10px;
}
input:-ms-input-placeholder {
  font-size: 10px;
}
[type="search"]::-webkit-search-cancel-button,
[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
  appearance: none;
}
.control {
  &.has-icons-right .icon {
    height: 40px;
    color: #999;
    font-size: 20px;
  }
}
.field {
  position: relative;
  margin: 0 10px;

  .search-button {
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    height: 100%;
    width: 44px;
    svg {
      width: 18px;
    }
  }
}
</style>
