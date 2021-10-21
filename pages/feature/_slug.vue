<template>
  <div class="container mb-5">
    <Breadcrumb :items="breadcrumbs" />
    <div v-if="feature" class="tile">
      <article class="tile is-child contents">
        <TopTitle title="FEATURE" theme="light" />
        <figure class="image is-fullwidth mb-4">
          <img :src="feature.thumbnail" />
        </figure>
        <div v-if="feature.period_from" class="has-text-right fs10 mb30 mr10">
          {{ feature.period_from | date }}
        </div>
        <div
          class="news-title has-text-weight-bold has-text-centered fs16 mb-3"
        >
          {{ feature.title }}
        </div>
        <div class="has-text-centered fs10 mb-5">
          {{ storeBrandName }}
        </div>
        <div class="ml10 mr10 ck-content" v-html="feature.body"></div>
        <template v-if="feature.is_item_setting">
          <TopTitle title="商品一覧" />
          <Goods :items="feature.items" />
        </template>
      </article>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TopTitle from "@/components/organisms/TopTitle";
import Breadcrumb from "@/components/organisms/Breadcrumb";
import Goods from "@/components/organisms/Goods";

export default {
  components: {
    TopTitle,
    Breadcrumb,
    Goods,
  },
  async fetch() {
    const { slug } = this.$route.params;
    await Promise.all([this.$store.dispatch("plans/get", { slug })]);
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      feature: "plans/detail",
      commonStoreBrands: "master/commonStoreBrands",
    }),
    storeBrand() {
      if (!this.commonStoreBrands.length) return "";
      const storeBrand = this.commonStoreBrands.find(
        (el) => el.value === this.feature.store_brand
      );
      return storeBrand;
    },
    storeBrandName() {
      if (!this.storeBrand) return "";
      return this.storeBrand.label;
    },
    breadcrumbs() {
      let tmp = [
        {
          id: 1,
          name: "HOME",
          url: "/",
        },
      ];
      if (this.storeBrand) {
        tmp = [
          ...tmp,
          ...[
            {
              id: 2,
              name: this.storeBrand.label,
              url: `/${this.storeBrand.key.toLowerCase()}`,
            },
            {
              id: 3,
              name: `${this.storeBrand.label}のFeature一覧`,
              url: `/${this.storeBrand.key.toLowerCase()}/feature`,
            },
          ],
        ];
      }
      tmp.push({
        id: 4,
        name: `${this.feature.title}`,
      });
      return tmp;
    },
    seoTitle() {
      if (!this.feature) {
        return "";
      }

      return `${this.feature.title} - ${this.storeBrandName}｜YAMADAYA onlinestore`;
    },
    seoMetaDescription() {
      if (!this.feature) {
        return "";
      }

      return this.feature.body.substring(0, 50) + "...";
    },
  },
  head() {
    return {
      title: this.seoTitle,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.seoMetaDescription,
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.container {
  max-width: $desktop;
  img {
    width: 100%;
    height: 140px;
    object-fit: cover;
  }
  .feature-title {
    color: $dark-pink;
  }
}
.sidemenu {
  @include touch {
    display: none;
  }
  @include desktop {
    flex: none;
    width: 25%;
    padding-right: 3%;
  }
}
.contents {
  @include touch {
    width: 100%;
  }
  @include desktop {
    flex: none;
    width: 100%;
  }
}
</style>
