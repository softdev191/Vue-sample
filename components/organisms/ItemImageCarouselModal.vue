<template>
  <BaseDialog ref="baseModal" :has-footer="false" @close="handleClose">
    <CarouselScaleItem
      v-if="isShow"
      :initial-slide="initialSlide"
      :item-images="images"
      class="c-wrapper"
    />
  </BaseDialog>
</template>

<script>
import BaseDialog from "@/components/atoms/BaseDialog";
import CarouselScaleItem from "@/components/organisms/CarouselScaleItem";

export default {
  name: "ItemImageCarouselModal",
  components: {
    BaseDialog,
    CarouselScaleItem,
  },
  data() {
    return {
      isShow: false,
      images: [],
      initialSlide: 0,
    };
  },
  methods: {
    handleClose() {
      this.close();
    },
    open({ images = [], selectedId = null } = {}) {
      this.images = images;

      const index = images.findIndex(
        ({ id }) => Number(id) === Number(selectedId)
      );
      this.initialSlide = index;

      this.$nextTick(() => {
        this.$refs.baseModal.show();
        this.isShow = true;
      });
    },
    close() {
      this.isShow = false;
      this.images = [];
      this.initialSlide = 0;
      this.$refs.baseModal.hide();
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

  &::v-deep {
    .fixed-container {
      padding: 0;
      margin: 0;
      width: 100%;
      height: 100%;

      .my-modal-content {
        height: 100%;
        max-height: 100%;
        padding: 20px 0;

        @include desktop {
          height: 92%;
          top: 4%;

          .my-modal-body {
            height: 100%;
            .c-wrapper {
              height: 100%;
              .agile {
                height: 100%;
                .agile__list {
                  height: 100%;
                  .agile__track {
                    height: 100%;
                  }
                }
              }
            }
          }

          .slide {
            height: 100%;
            .slide-wrapper {
              height: calc(100% - 25px);
              max-height: calc(100% - 25px);
              text-align: center;
              .slide-img {
                width: auto;
                max-width: 100%;
                height: auto;
                max-height: 100%;
                object-fit: contain;
              }
            }
            .slide-caption {
              text-align: center;
            }
          }
        }
      }
    }
  }
}
</style>
