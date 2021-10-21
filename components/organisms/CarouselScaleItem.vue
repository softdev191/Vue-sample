<template>
  <div>
    <client-only placeholder="Loading...">
      <CustomAgile
        ref="mainCarousel"
        :options="slickOptions"
        :initial-slide="initialSlide"
      >
        <div v-for="obj in itemImages" :key="obj.id" class="slide">
          <div class="slide-wrapper">
            <img
              class="slide-img"
              :alt="obj.caption"
              :src="$device.isDesktop ? obj.url : obj.url_l"
            />
          </div>
          <p class="is-size-7 slide-caption">
            {{ obj.caption }}
          </p>
        </div>
        <template slot="prevButton">
          <fa class="arrow" :icon="faAngleLeft" />
        </template>
        <template slot="nextButton">
          <fa class="arrow" :icon="faAngleRight" />
        </template>
      </CustomAgile>
    </client-only>
  </div>
</template>

<script>
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import CustomAgile from "@/components/atoms/CustomAgile";

export default {
  name: "Carousel",
  components: {
    CustomAgile,
  },
  props: {
    itemImages: {
      type: Array,
      default: () => [],
    },
    initialSlide: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      slickOptions: {
        slidesToShow: 1,
        infinite: true,
        accessibility: false,
        arrows: false,
        dots: false,
        draggable: false,
        edgeFriction: 0.3,
        swipe: false,
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
  },
  methods: {
    goToIndex(index) {
      this.$refs.mainCarousel.goTo(index);
    },
  },
};
</script>

<style lang="scss" scoped>
.slide {
  @include touch {
    width: 100%;
    max-width: $desktop;
    .slide-wrapper {
      width: 100%;
      max-width: 100%;
    }
    .slide-img {
      width: 100%;
      max-width: 100%;
    }
    .slide-caption {
      text-align: right;
    }
  }
  @include desktop {
    width: 100%;

    .slide-wrapper {
      height: 400px;
      width: 100%;
    }
    .slide-img {
      height: 400px;
      object-fit: cover;
      width: 100%;
    }
    .slide-caption {
      margin-top: 1px;
      text-align: right;
    }
  }
  .arrow {
    color: #000;
  }
}

::v-deep {
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
}
</style>
