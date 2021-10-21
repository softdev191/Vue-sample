<template>
  <div class="wrap" :style="setBackgroundColor">
    <div class="columns is-mobile is-multiline">
      <div
        v-for="(feature, index) in features"
        :key="index"
        class="column mb-6"
      >
        <nuxt-link
          :to="{
            name: 'feature-slug',
            params: { slug: feature.slug },
          }"
        >
          <figure class="image is-fullwidth mb-3">
            <img :src="feature.thumbnail" />
          </figure>
          <div class="mb-1 mx-3 word-break-all">{{ feature.title }}</div>
          <div class="mb-1 mx-3">
            {{ storeBrandLabel(feature.store_brand) }}
          </div>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    background: {
      type: String,
      default: "",
    },
    features: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapGetters({
      enums: "master/enums",
    }),
    setBackgroundColor() {
      return {
        "--background-color": this.background,
      };
    },
  },
  methods: {
    storeBrandLabel(index) {
      const storeBrand = this.enums.common__store_brand.find(
        ({ value }) => Number(value) === index
      );
      if (storeBrand) return storeBrand.label;
      else return "総合";
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  background-color: var(--background-color);
  font-size: $size-7;
  @include touch {
    padding-bottom: 50px;
  }
}
.columns {
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  justify-content: space-between;
}
.column {
  padding: 0;
  flex: none;
  @include touch {
    width: calc(50% - 3px);
  }
  @include desktop {
    width: calc(33% - 3px);
  }
}
.image {
  img {
    object-fit: cover;
    width: 100%;
    @include touch {
      height: 114px;
    }
    @include desktop {
      height: 156px;
    }
  }
}
.tags {
  color: $dark-pink;
  font-weight: 600;
}
</style>
