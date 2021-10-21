<template>
  <BaseDialog ref="baseModal" :has-footer="false" @close="handleClose">
    <template #header>
      <div class="my-modal-title">店舗の在庫を見る</div>
      <a class="header-icon sp-only" @click.prevent="handleClose">
        <fa :icon="faChevronLeft" />
      </a>
    </template>
    <ItemStoreList
      v-if="isShow"
      :item="item"
      class="c-wrapper"
      @buy="handleBuy"
    />
  </BaseDialog>
</template>

<script>
import BaseDialog from "@/components/atoms/BaseDialog";
import ItemStoreList from "@/components/organisms/ItemStoreList";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

export default {
  name: "ItemStoreListDialog",
  components: {
    BaseDialog,
    ItemStoreList,
  },
  data() {
    return {
      faChevronLeft,
      isShow: false,
      item: {},
    };
  },
  methods: {
    handleClose() {
      this.close();
    },
    handleBuy() {
      this.$emit("buy");
      this.close();
    },
    open({ item }) {
      this.item = item;

      this.$nextTick(() => {
        this.$refs.baseModal.show();
        this.isShow = true;
      });
    },
    close() {
      this.item = {};
      this.isShow = false;

      if (this.$refs.baseModal.isShow) {
        this.$refs.baseModal.hide();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.my-modal-wrapper {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  z-index: 10000;

  .header-icon {
    display: block;
    position: absolute;
    top: 14px;
    left: 11px;
    @include desktop {
      display: none;
    }
  }

  &.request-form {
    &::v-deep {
      .my-modal-content {
        .my-modal-header {
          .my-modal-close {
            display: block;
            @include touch {
              display: none;
            }
          }
        }
      }
    }
  }
  &.complete {
    .header-icon {
      display: none;
    }

    &::v-deep {
      .my-modal-content {
        .my-modal-header {
          .my-modal-close {
            display: block;
          }
        }
      }
    }
  }

  &::v-deep {
    .fixed-container {
      padding: 0;
      margin: 0;
      width: 100%;
      height: 100%;

      @include desktop {
        max-width: 1080px;
      }

      .my-modal-content {
        height: 100%;
        max-height: 100%;
        padding: 0 0 20px 0;

        @include desktop {
          padding-left: 44px;
          padding-right: 44px;
        }

        .my-modal-header {
          height: 54px;
          border-bottom: 1px solid #dbdbdb;
          position: relative;

          @include desktop {
            border-bottom: 0;
            height: 66px;
          }

          .my-modal-title {
            height: 100%;
            padding-top: 19px;
            text-align: center;
            font-weight: normal;

            @include desktop {
              padding-top: 36px;
            }
          }
        }

        .my-modal-body {
          padding: 0 0 30px 0;
        }

        @include desktop {
          height: 92%;
          top: 4%;
          .my-modal-body {
            padding: 15px 0 30px 0;
            height: 100%;
            max-height: 400px;
            .c-wrapper {
              height: 100%;
            }
          }
        }
      }
    }
  }
}
.complete-title {
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  padding: 18px 0;
}
.complete-body {
  padding: 0 2%;
}
</style>
