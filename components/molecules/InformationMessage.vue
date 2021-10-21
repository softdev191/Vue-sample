<template>
  <div class="info-component">
    <a @click="open" class="text">
      <InfoIcon :class="{ right: alignRight }" />
      <span v-if="showText">{{ dialogTitle }}</span>
    </a>

    <BaseDialog
      ref="infoDialog"
      :title="dialogTitle"
      :has-ok="false"
      :has-cancel="false"
    >
      <slot name="message" />
    </BaseDialog>
  </div>
</template>

<script>
import InfoIcon from "@/assets/images/icons/info-icon.svg";
import BaseDialog from "@/components/atoms/BaseDialog";
export default {
  components: {
    InfoIcon,
    BaseDialog,
  },
  props: {
    text: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      default: "",
    },
    alignRight: {
      type: Boolean,
      default: false,
    },
    dialogTitle: {
      type: String,
      default: "",
    },
    showText: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    open() {
      this.$refs.infoDialog.show();
    },
  },
};
</script>

<style lang="scss" scoped>
.info-component {
  display: inline-flex;
  align-items: center;
  > svg {
    margin-right: 6px;
  }
  > .text {
    font-size: 10px;
    color: $black;
    vertical-align: middle;
    text-align: left;
    > svg {
      vertical-align: middle;
      &.right {
        position: absolute;
        right: 5px;
        top: -1px;
      }
    }
  }
}
</style>
