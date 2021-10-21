<template>
  <div>
    <client-only placeholder="Loading...">
      <agile :options="slickOptions">
        <img class="slide" src="@/assets/images/stylings1.png" />
        <img class="slide" src="@/assets/images/stylings1.png" />
        <img class="slide" src="@/assets/images/stylings1.png" />
        <img class="slide" src="@/assets/images/stylings1.png" />
        <img class="slide" src="@/assets/images/stylings1.png" />
        <template slot="prevButton">
          <fa class="arrow" :icon="faAngleLeft" />
        </template>
        <template slot="nextButton">
          <fa class="arrow" :icon="faAngleRight" />
        </template>
      </agile>
    </client-only>
    <div class="columns is-mobile is-gapless">
      <img class="column" src="@/assets/images/stylings1.png" />
      <img class="column" src="@/assets/images/stylings1.png" />
      <img class="column" src="@/assets/images/stylings1.png" />
      <img class="column" src="@/assets/images/stylings1.png" />
      <img class="column" src="@/assets/images/stylings1.png" />
      <img class="column" src="@/assets/images/stylings1.png" />
      <img class="column" src="@/assets/images/stylings1.png" />
      <img class="column" src="@/assets/images/stylings1.png" />
    </div>
  </div>
</template>

<script>
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
export default {
  name: "Carousel",
  components: {},
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
  },
};
</script>
<style lang="scss" scoped>
.slide {
  @include touch {
    width: 100%;
    max-width: $desktop;
  }
  @include desktop {
    width: 100%;
    height: 400px;
    object-fit: cover;
  }
  .arrow {
    color: $black;
  }
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
</style>
