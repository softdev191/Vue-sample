<template>
  <div class="dropdown-section">
    <div class="dropdown-section-header" @click="toggle">
      <slot name="title" />
      <fa
        v-if="!disabled"
        class="angle-down"
        :icon="faChevronDown"
        :class="{ rotate: isShow }"
      />
    </div>
    <div v-if="divider" class="full-divider"></div>
    <Dropdown name="dropdown" :max-height="maxHeight">
      <div v-show="isShow">
        <slot name="content" />
      </div>
    </Dropdown>
  </div>
</template>

<script>
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "@/components/molecules/transision/Dropdown";

export default {
  components: {
    Dropdown,
  },
  props: {
    maxHeight: {
      type: Number,
      required: true,
    },
    defaultStatus: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    divider: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      error: null,
      isShow: false,
      faChevronDown,
    };
  },
  mounted() {
    if (this.disabled) {
      this.isShow = true;
    } else {
      this.isShow = this.defaultStatus;
    }
  },
  methods: {
    toggle() {
      if (this.disabled) {
        return;
      }
      this.isShow = !this.isShow;
    },
  },
};
</script>

<style lang="scss" scoped>
.dropdown-section {
  .dropdown-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    line-height: 1;
    padding: 16px 0;
    .angle-down {
      transition-duration: 0.3s;
    }
    .rotate {
      transform: rotate(180deg);
    }
  }
}
</style>
