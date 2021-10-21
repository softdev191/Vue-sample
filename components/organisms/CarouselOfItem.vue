<template>
  <div class="item-detail-carousel">
    <client-only>
      <agile
        ref="mainCarousel"
        :options="slickOptions"
        @after-change="handleAfterChange($event)"
      >
        <div v-for="obj in itemImages" :key="obj.id" class="slide">
          <div class="slide-wrapper" @click="handleClickMainImage(obj)">
            <img
              class="slide-img"
              :alt="obj.caption"
              :src="$device.isDesktop ? obj.url_xl : obj.url_l"
            />
            <slot name="overlay"></slot>
          </div>
          <p class="has-text-right is-size-7 slide-caption mr-2 mt-2">
            {{ obj.caption }}
          </p>
        </div>
        <template slot="prevButton">
          <ChevronLeft />
        </template>
        <template slot="nextButton">
          <ChevronRight />
        </template>
      </agile>
      <div class="slide-dummy" slot="placeholder" />
    </client-only>
    <div class="thumb-list--wrapper">
      <ul class="thumb-list" :style="thumnListWidth">
        <li v-for="(obj, index) in itemImages" :key="obj.id">
          <img
            :src="obj.url_s"
            :class="[index === selectedImage ? 'active' : '']"
            @click="goToIndex(index)"
          />
        </li>
      </ul>
    </div>
    <client-only v-if="false" placeholder="Loading...">
      <agile
        ref="thumbCarousel"
        :options="thumbCarouselOptions"
        class="item-thumb-slider"
      >
        <div v-for="obj in itemImages" :key="obj.id" class="slide">
          <img :src="obj.url_s" />
        </div>
      </agile>
    </client-only>
  </div>
</template>

<script>
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import ChevronLeft from "@/assets/images/icons/chevron-left-thin-icon.svg";
import ChevronRight from "@/assets/images/icons/chevron-right-thin-icon.svg";

export default {
  name: "Carousel",
  emits: ["clickMainImage"],
  components: {
    ChevronLeft,
    ChevronRight,
  },
  props: {
    itemImages: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedImage: 0,
      slickOptions: {
        slidesToShow: 1,
        infinite: true,
        accessibility: false,
        arrows: false,
        dots: false,
        draggable: false,
        edgeFriction: 0.3,
        swipe: true,
      },
      thumbCarouselOptions: {
        slidesToShow: 4,
        infinite: true,
        arrows: false,
        dots: false,
        swipe: true,
      },
    };
  },
  computed: {
    faAngleRight() {
      return faAngleRight;
    },
    faAngleLeft() {
      return faAngleLeft;
    },
    thumnListWidth() {
      return { width: `${this.itemImages.length * 75}px` };
    },
  },
  methods: {
    goToIndex(index) {
      this.$refs.mainCarousel.goTo(index);
    },
    handleClickMainImage(image) {
      this.$emit("clickMainImage", { ...image });
    },
    handleAfterChange(event) {
      this.selectedImage = event.currentSlide;
    },
  },
};
</script>

<style lang="scss">
.item-detail-carousel {
  .slide {
    @include touch {
      width: 100%;
      max-width: $desktop;
      .slide-wrapper {
        width: 100%;
        max-width: 100%;
        position: relative;
        line-height: 0;
        height: 450px;
      }
      .slide-img {
        width: 100%;
        max-width: 100%;
        height: 450px;
        object-fit: cover;
      }
    }
    @include desktop {
      width: 100%;

      .slide-wrapper {
        height: 580px;
        width: 100%;
        position: relative;
        line-height: 0;
      }
      .slide-img {
        height: 580px;
        object-fit: cover;
        width: 100%;
      }
      .slide-caption {
        margin-top: 1px;
      }
    }
  }

  .arrow {
    color: #000;
  }

  .columns {
    display: flex;
    width: auto;
    overflow-x: auto;
    height: 70px;
    margin: 0;
    .column {
      height: 60px;
      margin: 5px 2.5px !important;
    }
  }

  .agile {
    position: relative;
    .agile__actions {
      position: absolute;
      top: 50%;
      width: 100%;

      .agile__nav-button--prev,
      .agile__nav-button--next {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        border: 0;
        background: none;
        :hover {
          cursor: pointer;
        }
      }
    }
  }

  .thumb-list {
    li {
      &:hover {
        cursor: pointer;
      }
      img.active {
        border: 2px solid #6c6c6c;
      }
    }
  }
  @include touch {
    .thumb-list--wrapper {
      overflow: auto;
      padding-bottom: 5px;
      margin: 20px 10px 0;
      .thumb-list {
        margin: 0;
        li {
          flex: 75px;
          max-width: 75px;
        }
      }
    }
  }
  @include desktop {
    .thumb-list--wrapper {
      .thumb-list {
        width: auto !important;
      }
    }
  }

  .slide-dummy {
    height: 580px;
    width: 100%;
    @include touch {
      height: 450px;
    }
  }
}
</style>
