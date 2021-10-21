<template>
  <div class="container mb-5">
    <Breadcrumb :items="breadcrumbs" />
    <div class="tile">
      <article class="tile is-child contents">
        <TopTitle title="NEWS" theme="light" />
        <figure v-if="news.thumbnail" class="image is-fullwidth mb-4">
          <img :src="news.thumbnail" />
        </figure>
        <div v-if="news.period_from" class="has-text-right fs10 mb30 mr10">
          {{ news.period_from | date }}
        </div>
        <div
          class="news-title has-text-weight-bold has-text-centered fs16 mb-3"
        >
          {{ news.title }}
        </div>
        <div class="has-text-centered fs10 mb-5">{{ storeBrandName }}</div>
        <div class="ml10 mr10 ck-content" v-html="news.body"></div>
        <template v-if="news.is_item_setting">
          <TopTitle title="商品一覧" />
          <Goods :items="news.items" />
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
    await this.$store.dispatch("plans/get", { slug });
  },
  data() {
    return {};
  },
  computed: {
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
              name: `${this.storeBrand.label}のNews一覧`,
              url: `/${this.storeBrand.key.toLowerCase()}/news`,
            },
          ],
        ];
      }
      tmp.push({
        id: 4,
        name: `${this.news.title}`,
      });
      return tmp;
    },
    ...mapGetters({
      commonStoreBrands: "master/commonStoreBrands",
      news: "plans/detail",
    }),
    storeBrand() {
      if (!this.commonStoreBrands.length) return "";
      const storeBrand = this.commonStoreBrands.find(
        (el) => el.value === this.news.store_brand
      );
      return storeBrand;
    },
    storeBrandName() {
      if (!this.storeBrand) return "";
      return this.storeBrand.label;
    },
    seoTitle() {
      if (!this.news) {
        return "";
      }

      return `${this.news.title} - ${this.storeBrandName}｜YAMADAYA onlinestore`;
    },
    seoMetaDescription() {
      if (!this.news) {
        return "";
      }

      return this.news.body.substring(0, 50) + "...";
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
  .news-title {
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
