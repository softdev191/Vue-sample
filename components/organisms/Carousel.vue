<template>
  <div v-if="main_visuals" class="top-main-visual-carousel">
    <client-only>
      <agile
        :nav-buttons="false"
        :autoplay-speed="5000"
        :speed="300"
        pause-on-hover="pause-on-hover"
        pause-on-dots-hover="pause-on-dots-hover"
        autoplay="autoplay"
        fade="fade"
      >
        <div v-for="(slider, index) in main_visuals" :key="index">
          <template v-if="slider.url">
            <template v-if="isInternalLink(slider.url)">
              <nuxt-link :to="getUrl(slider.url)">
                <img
                  class="slide"
                  :class="[$device.isDesktop ? 'pc-slide' : 'sp-slide']"
                  :src="$device.isDesktop ? slider.pc_path : slider.sp_path"
                />
              </nuxt-link>
            </template>
            <template v-else>
              <a :href="slider.url" target="_blank">
                <img
                  class="slide"
                  :class="[$device.isDesktop ? 'pc-slide' : 'sp-slide']"
                  :src="$device.isDesktop ? slider.pc_path : slider.sp_path"
                />
              </a>
            </template>
          </template>
          <img
            v-else
            class="slide"
            :class="[$device.isDesktop ? 'pc-slide' : 'sp-slide']"
            :src="$device.isDesktop ? slider.pc_path : slider.sp_path"
          />
        </div>
      </agile>
      <div class="slide-dummy" slot="placeholder" />
    </client-only>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Carousel",
  components: {},
  data() {
    return {
      slickOptions: {
        slidesToShow: 1,
        infinite: true,
        accessibility: true,
        arrows: true,
        dots: true,
        draggable: true,
        edgeFriction: 0.3,
        swipe: true,
      },
      location: null,
    };
  },
  computed: {
    ...mapGetters({
      main_visuals: "top/main_visuals",
    }),
  },

  mounted() {
    this.location = window.location;
  },

  methods: {
    isInternalLink(url) {
      return url.includes(this.location?.host);
    },
    getUrl(url) {
      return url.replace(
        this.location?.origin,
        url === this.location?.origin ? "/" : ""
      );
    },
  },
};
</script>
<style lang="scss">
.top-main-visual-carousel {
  .agile__nav-button {
    background: transparent;
    border: none;
    color: #fff;
    cursor: pointer;
    font-size: 24px;
    height: 100%;
    position: absolute;
    top: 0;
    -webkit-transition-duration: 0.3s;
    transition-duration: 0.3s;
    width: 80px;
  }
  .agile__nav-button:hover {
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 1;
  }
  .agile__nav-button--prev {
    left: 0;
  }
  .agile__nav-button--next {
    right: 0;
  }
  .agile__dots {
    bottom: 20px;
    left: 50%;
    position: absolute;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
  }
  .agile__dot {
    margin: 0 8px;
    @include touch {
      margin: 0 5px;
    }
  }
  .agile__dot button {
    background-color: transparent;
    border: 1px solid #fff;
    border-radius: 50%;
    cursor: pointer;
    display: block;
    height: 10px;
    font-size: 0;
    line-height: 0;
    margin: 0;
    padding: 0;
    -webkit-transition-duration: 0.3s;
    transition-duration: 0.3s;
    width: 10px;
    @include touch {
      width: 6px;
      height: 6px;
    }
  }
  .agile__dot--current button,
  .agile__dot:hover button {
    background-color: #fff;
  }
  .slide {
    display: flex;
    height: 400px;
    object-fit: cover;
    @include touch {
      width: 100%;
      max-width: $desktop;
    }
    @include desktop {
      width: 100%;
      height: 400px;
      object-fit: cover;
    }
  }

  .slide-dummy {
    width: 100%;
    height: 400px;
  }
}
</style>
