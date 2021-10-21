<template>
  <div v-if="news" class="top-news--wrapper">
    <div class="top-news-list--wrapper">
      <ul class="top-news-list">
        <li v-for="(el, index) in news" :key="index">
          <nuxt-link
            :to="{ name: 'news-slug', params: { slug: el.slug } }"
            class="news-item"
          >
            <figure class="news-item--img">
              <img :src="el.thumbnail" />
            </figure>
            <div class="news-item--info">
              <h3>{{ el.title }}</h3>
              <p>{{ storeBrandLabel(el.store_brand) }}</p>
              <span class="news-item--date">{{ el.period_from | date }}</span>
            </div>
          </nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "News",
  props: {
    news: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    storeBrandLabel(index) {
      const storeBrand = this.$store.getters[
        "master/enums"
      ].common__store_brand.find(({ value }) => Number(value) === index);
      if (storeBrand) return storeBrand.label;
      else return "総合";
    },
  },
};
</script>

<style lang="scss" scoped>
.top-news-list--wrapper {
  margin-bottom: 30px;
  overflow: hidden;
  .top-news-list {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -20px;
    > li {
      flex: 50%;
      max-width: 50%;
      padding: 0 20px;
      @include touch {
        flex: 100%;
        max-width: 100%;
      }
      .news-item {
        display: flex;
        padding: 15px 0;
        border-bottom: 1px solid #dbdbdb;
        .news-item--img {
          img {
            width: 120px;
            height: 120px;
            object-fit: cover;
          }
        }
        .news-item--info {
          position: relative;
          flex: 1;
          font-size: 10px;
          padding-left: 15px;
          h3 {
            font-size: 12px;
            margin-bottom: 6px;
          }
          .news-item--date {
            position: absolute;
            color: #6c6c6c;
            bottom: 0;
            right: 10px;
          }
        }
      }
    }
  }
}
</style>
