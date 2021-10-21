<template>
  <div class="wrap mb100">
    <div class="narrowdown-menu">
      <h2 class="index fs14 mt-5 mb-5 has-text-centered">絞り込み条件</h2>
      <div class="full-divider-dark mb-4" />
      <div class="mb-4 is-size-6 has-text-centered">絞り込み結果 : 20 件</div>
      <div class="full-divider" />
      <div class="columns is-mobile is-gapless">
        <div class="column">
          <a class="is-size-7" @click="toggleComponent('brand')">
            <img class="mt15" src="@/assets/images/home-icon.png" />
            <p class="pt-1">ストア<br />ブランド</p>
          </a>
          <div class="count fs8 count-brand">12</div>
        </div>
        <div class="column">
          <a class="is-size-7" @click="toggleComponent('category')">
            <img class="mt15" src="@/assets/images/layers-icon.png" />
            <p class="pt-3">カテゴリー</p>
          </a>
          <div class="count fs8 count-category">3</div>
        </div>
        <div class="column">
          <a class="is-size-7" @click="toggleComponent('height')"
            ><img class="mt15" src="@/assets/images/height-icon.png" />
            <p class="pt-2">身長</p>
          </a>
          <div class="count fs8 count-height">10</div>
        </div>
      </div>
      <div class="full-divider" />
    </div>

    <div class="toggle-area container">
      <div v-show="showComponent === 'brand'" class="relative mb-5">
        <div class="columns is-mobile is-multiline is-gapless">
          <div v-for="(brand, index) in brands" :key="index" class="column">
            <div class="form-group">
              <input
                id="brand"
                type="checkbox"
                name="brand"
                class="form-checkbox"
              />
              <label for="brand">{{ brand.name }}</label>
            </div>
          </div>
        </div>
        <NarrowDownButton class="mb-5" />
      </div>
      <div v-show="showComponent === 'category'" class="relative mb-5">
        <div class="columns is-mobile is-multiline is-gapless">
          <div
            v-for="(category, index) in categories"
            :key="index"
            class="column"
            :class="{ full: category.topCategory }"
          >
            <div class="form-group">
              <input
                id="category"
                type="checkbox"
                name="category"
                class="form-checkbox"
              />
              <label for="category">{{ category.name }}</label>
            </div>
          </div>
        </div>
        <NarrowDownButton class="mb-5" />
      </div>
      <div v-show="showComponent === 'height'" class="relative mb-5">
        <div class="columns is-mobile is-multiline is-gapless">
          <div v-for="(height, index) in heights" :key="index" class="column">
            <div class="form-group">
              <input
                id="height"
                type="checkbox"
                name="height"
                class="form-checkbox"
              />
              <label for="height">{{ height.name }}</label>
            </div>
          </div>
        </div>
        <NarrowDownButton class="mb-5" />
      </div>
    </div>
  </div>
</template>

<script>
import NarrowDownButton from "@/components/organisms/NarrowDownButton.vue";

export default {
  components: {
    NarrowDownButton,
  },
  data() {
    return {
      showComponent: "",
      brands: [
        {
          id: 1,
          name: "MEDOC",
        },
        {
          id: 2,
          name: "LASUD",
        },
        {
          id: 3,
          name: "Vin",
        },
        {
          id: 4,
          name: "Aga",
        },
        {
          id: 5,
          name: "FENNEL",
        },
      ],
      categories: [
        {
          id: 1,
          name: "トップスすべて",
          topCategory: true,
        },
        {
          id: 2,
          name: "ニット・セーター",
          topCategory: false,
        },
        {
          id: 3,
          name: "カットソー・Tシャツ",
          topCategory: false,
        },
        {
          id: 4,
          name: "パーカー・スエット",
          topCategory: false,
        },
        {
          id: 5,
          name: "シャツ・ブラウス",
          topCategory: false,
        },
        {
          id: 6,
          name: "スカートすべて",
          topCategory: true,
        },
      ],
      heights: [
        {
          id: 1,
          name: "~149cm",
        },
        {
          id: 2,
          name: "150cm~159cm",
        },
        {
          id: 3,
          name: "160cm~169cm",
        },
        {
          id: 4,
          name: "170cm~",
        },
      ],
    };
  },
  methods: {
    toggleComponent(val) {
      this.showComponent = val;
    },
  },
};
</script>
<style lang="scss" scoped>
.wrap {
  position: relative;
  height: 264px;
  .toggle-area {
    position: absolute;
    z-index: 99999;
    width: 100%;
    background-color: $white;
    .relative {
      position: relative;
    }
    .column {
      flex: none;
      width: 50%;
      padding-left: 10px !important;
    }
    .full {
      width: 100%;
      font-weight: bold;
    }
  }
  .narrowdown-menu {
    height: auto;
    padding: 0 0 20px 0 !important;
    width: 100%;
    .columns {
      margin-bottom: 0 !important;
    }
    .column {
      height: 70px;
      background-color: $gray;
      text-align: center;
      flex: none;
      width: 33.5%;
      border-right: solid 1px $middle-gray;

      a {
        display: block;
        width: 100%;
        font-size: 8px;
        color: $black;
        img {
          position: relative;
        }
      }
      .count {
        display: block;
        position: absolute;
        top: 90px;
        color: $white;
        width: 18px;
        height: 18px;
        text-align: center;
        padding: 1px;
        border: 1px solid $black;
        background-color: $black;
        border-radius: 50%;
        z-index: 1;
      }
      .count-brand {
        left: 18%;
      }
      .count-category {
        left: 52%;
      }
      .count-height {
        left: 85%;
      }
      &:hover {
        background-color: $white;
      }
    }
  }
}
</style>
