<template>
  <div class="my-modal-wrapper" :class="{ 'is-open': isShow }">
    <div class="my-modal-mask" @click="out"></div>
    <div class="fixed-container">
      <div class="my-modal-content">
        <div class="my-modal-header">
          <slot name="header">
            <div class="my-modal-title" :class="titleClass">
              {{ title }}
            </div>
          </slot>
          <span v-if="hasCloseButton" class="my-modal-close" @click="close">
            <CloseIconSvg />
          </span>
        </div>
        <div class="my-modal-body" :class="{ pb0: !hasFooter }">
          <slot></slot>
        </div>
        <div v-if="hasFooter" class="my-modal-footer">
          <slot name="footer">
            <div class="my-modal-actions">
              <ButtonWrapper :theme="buttonWrapperTheme">
                <Button
                  v-if="hasCancel"
                  :class="cancelClass"
                  :disabled="pending"
                  theme="light"
                  @click="cancel"
                >
                  {{ cancelText }}
                </Button>
                <Button
                  v-if="hasOk"
                  theme="dark"
                  :class="okClass"
                  :disabled="invalid"
                  :pending="pending"
                  @click="ok"
                >
                  {{ okText }}
                </Button>
              </ButtonWrapper>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CloseIconSvg from "@/assets/images/icons/close-icon.svg";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";
export default {
  components: {
    CloseIconSvg,
    ButtonWrapper,
    Button,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    titleClass: {
      type: [String, Array, Object],
      default: "",
    },
    okText: {
      type: String,
      default: "確認",
    },
    cancelText: {
      type: String,
      default: "キャンセル",
    },
    hasOk: {
      type: Boolean,
      default: true,
    },
    hasCancel: {
      type: Boolean,
      default: true,
    },
    hasCloseButton: {
      type: Boolean,
      default: true,
    },
    okClass: {
      type: [String, Array],
      default: "",
    },
    cancelClass: {
      type: [String, Array],
      default: "",
    },
    hasFooter: {
      type: Boolean,
      default: true,
    },
    disableClickBackground: {
      type: Boolean,
      default: false,
    },
    invalid: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isShow: false,
      payload: undefined,
      buttonWrapperTheme: this.hasOk && this.hasCancel ? "flex" : "normal",
    };
  },
  computed: {
    pending() {
      return this.$store.getters["common/pending"];
    },
  },
  methods: {
    show(payload = null) {
      if (payload) {
        this.payload = payload;
      }
      this.isShow = true;
    },
    hide() {
      this.payload = undefined;
      this.isShow = false;
    },
    out() {
      if (this.disableClickBackground) {
        return;
      }

      this.$emit("out");
      this.hide();
    },
    close() {
      this.$emit("close");
      this.hide();
    },
    cancel() {
      this.$emit("cancel", this.payload);
    },
    ok() {
      this.$emit("ok", this.payload);
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.btn {
  padding-left: 10px;
  padding-right: 10px;
}
.my-modal-wrapper {
  transition-duration: 0.2s;
  z-index: 100;
  position: fixed;
  top: 100px;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  opacity: 0;
  pointer-events: none;
  .my-modal-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9;
  }
  .my-modal-content {
    position: relative;
    min-width: 355px;
    max-height: calc(100vh - 200px);
    z-index: 10;
    background-color: #fff;
    padding: 20px 10px;
    transform: translateY(20px);
    transition: 0.4s;
    overflow: auto;
    .my-modal-header {
      font-weight: bold;
      color: $black;
      font-size: 20px;
      .my-modal-title {
        color: $black;
        font-size: 20px;
        line-height: 1;
        @include desktop {
          text-align: center;
        }
        &.normal {
          font-size: 14px;
          font-weight: normal;
        }
      }
      .my-modal-close {
        position: absolute;
        top: 20px;
        right: 10px;
        width: 12px;
        height: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 12px;
        cursor: pointer;
        @include desktop {
          top: 30px;
          right: 30px;
          width: 15px;
          height: 15px;
        }
      }
    }
    .my-modal-body {
      color: $black;
      font-size: 12px;
      line-height: 22px;
      padding: 30px 0;
    }
    .my-modal-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      > .btn {
        &.cancel {
          color: $white;
          background-color: #6c6c6c;
          border: 1px solid #6c6c6c;
        }
        &.ok {
          border: 1px solid $black;
        }
        + .btn {
          margin-left: 10px;
        }
      }
    }
  }
  &.is-open {
    opacity: 1;
    pointer-events: all;
    .my-modal-content {
      transform: none;
    }
  }
}
</style>
