<template>
  <div :class="{ dark: theme === 'dark' }">
    <div
      class="columns is-mobile is-multiline"
      :class="{ four: size == 4, five: size == 5 }"
    >
      <div v-for="(brand, index) in storeBrands" :key="index" class="column">
        <nuxt-link
          v-if="footer"
          :to="{
            name: 'brands-brand-all',
            params: { brand: brand.key.toLowerCase() },
          }"
        >
          <figure class="image crop">
            <img :src="require(`@/assets/images/logo-${brand.label}.png`)" />
          </figure>
        </nuxt-link>
        <nuxt-link v-else :to="`/brands/${brand.key.toLowerCase()}`">
          <figure class="image crop">
            <img :src="require(`@/assets/images/logo-${brand.label}.png`)" />
          </figure>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: Number,
      default: 4,
    },
    theme: {
      type: String,
      default: "light",
    },
    footer: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    storeBrands() {
      return this.$store.getters["master/enums"].common__store_brand;
    },
  },
};
</script>

<style lang="scss" scoped>
.columns {
  padding: 2px 2px;
  margin: 0;
  display: flex;
  flex-direction: row;

  .column {
    padding: 2px 2px;
    margin: 0;
  }
}
@include desktop {
  .dark {
    background-color: $gray;
  }
  .columns {
    padding-bottom: 50px;
    justify-content: start;
    margin-bottom: 30px !important;

    &.four {
      .column {
        flex: none;
        width: 25%;
      }
    }
    &.five {
      .column {
        flex: none;
        width: 20%;
      }
    }
  }
}
@include touch {
  .columns {
    justify-content: space-evenly;
    padding-bottom: 30px;
    margin-bottom: 50px;
  }
  .column {
    width: 50%;
    flex: none;
  }
  .column:first-child {
    width: 100%;
    flex: none;
  }
}
.crop img {
  width: 100%;
  height: 70px;
  object-fit: cover;
}
</style>
