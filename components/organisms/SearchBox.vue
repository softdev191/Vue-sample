<template>
  <div class="field">
    <div class="control has-icons-right">
      <input
        v-model="search"
        class="input fs10"
        type="search"
        :placeholder="placeholder"
        @keyup.enter="handleSearch"
      />
      <span class="icon is-right" @click="handleSearch">
        <SearchIconSvg class="menu-icon" />
      </span>
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
  },
  data() {
    return {
      search: "",
    };
  },
  mounted() {
    this.search = this.$route.query.q;
  },
  methods: {
    handleSearch(e) {
      if (this.search === this.$route.query.q) {
        this.$emit("search", this.search);
      } else {
        this.$router.push({
          path: "/helps/search",
          query: {
            q: this.search,
          },
        });
      }
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
  margin: 0 10px;
  @include touch {
    margin: 0 10px;
  }
  @include desktop {
    margin: 0 10px;
  }
  &.has-icons-right .icon {
    pointer-events: auto;
    height: 40px;
    color: #999;
    font-size: 20px;
  }
}
.menu-icon {
  height: 20px;
}
</style>
