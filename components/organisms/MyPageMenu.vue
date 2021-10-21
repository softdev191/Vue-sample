<template>
  <div>
    <aside class="menu">
      <transition name="fade">
        <div v-show="!(showBrand || showCategory)">
          <div :class="{ guest: isGuest, invisible: !isGuest }">
            <div class="buttons">
              <button class="button light">ログイン</button>
              <button class="button dark">新規登録</button>
            </div>
          </div>
          <div :class="{ login: !isGuest, invisible: isGuest }">
            <div>
              <span class="point-label"> 利用できるポイント</span
              ><span class="point">3,400ポイント</span>
            </div>
            <div>
              <span class="point-label">有効期限</span>
              ：
              <span class="point-label">2020/10/25</span>

              <fa :icon="faQuestionCircle" class="icon-right" />
            </div>
          </div>
          <ul class="menu-list is-size-6">
            <li><a>お気に入りした商品</a></li>
            <li>
              <a @click="showBrand = !showBrand"
                >ストアブランドから探す
                <div class="header-icon angle-right"></div
              ></a>
            </li>
            <li>
              <a @click="showCategory = !showCategory"
                >カテゴリーから探す
                <div class="header-icon angle-right"></div
              ></a>
            </li>
            <li><a>新着商品</a></li>
            <li><a>予約商品</a></li>
            <li><a>セール商品</a></li>
            <li><a>スタイリング</a></li>
            <li><a>特集</a></li>
            <li><a>NEWS</a></li>
            <li><a>店舗検索</a></li>
            <li><a>サイズガイド</a></li>
            <li><a>ご利用ガイド/ヘルプ</a></li>
            <li><a>お問い合わせ</a></li>
          </ul>
        </div>
      </transition>
      <transition name="fade">
        <div v-show="showBrand">
          <ul class="menu-list is-size-6">
            <li>
              <a @click="showBrand = !showBrand"
                >&nbsp;
                <div class="header-icon angle-left"></div
              ></a>
            </li>
            <li><a>MEDOC</a></li>
            <li><a>LASUD</a></li>
            <li><a>Vin</a></li>
          </ul>
        </div>
      </transition>
      <transition name="fade">
        <div v-show="showCategory">
          <ul class="menu-list is-size-6">
            <li>
              <a @click="showCategory = !showCategory"
                >&nbsp;
                <div class="header-icon angle-left"></div
              ></a>
            </li>
            <p class="menu-label is-size-6">トップス</p>
            <li><a>全てのトップス</a></li>
            <li><a>ニット・セーター</a></li>
          </ul>
        </div>
      </transition>
    </aside>
  </div>
</template>

<script>
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

export default {
  components: {},
  data() {
    return {
      showFilter: true,
      showBrand: false,
      showCategory: false,
      isGuest: false,
    };
  },
  computed: {
    faQuestionCircle() {
      return faQuestionCircle;
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.buttons {
  justify-content: space-between;
  padding: 0 10px;
}
.button {
  width: 48.6%;
  height: 42px;
  border-radius: 0;
  margin: 0 !important;
  &.light {
    background-color: #fff;
    border-color: #000;

    &:hover {
      background-color: #6c6c6c;
      color: #fff;
      border-color: #6c6c6c;
    }
  }
  &.dark {
    background-color: #6c6c6c;
    color: #fff;
    border-color: #6c6c6c;
    &:hover {
      background-color: #fff;
      border-color: #000;
      color: #000;
    }
  }
}

.menu {
  padding-top: 60px;
}
.menu-label {
  border-bottom: solid 1px #a7a7a7;
  padding: 10px 5px;
  color: #4a4a4a;
  margin: 10px 5px 0 5px;
  font-weight: 600;
}
.menu-list li {
  a {
    border-top: solid 1px #dbdbdb;
    padding: 15px 5px;
    margin: 0 5px 0 5px;
    position: relative;
  }

  &:last-child > a {
    border-bottom: solid 1px #dbdbdb;
  }
}

.angle-right {
  border: solid black;
  border-width: 0 1px 1px 0;
  display: inline-block;
  position: absolute;
  padding: 4px;
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  top: 18px;
  right: 10px;
}
.angle-left {
  border: solid black;
  border-width: 0 1px 1px 0;
  display: inline-block;
  position: absolute;
  padding: 4px;
  transform: rotate(135deg);
  -webkit-transform: rotate(135deg);
  top: 18px;
  left: 10px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.invisible {
  display: none;
}
.guest {
  display: block;
  margin-bottom: 12px;
}
.login {
  display: block;
  margin-bottom: 12px;
  height: 42px;
  text-align: center;
  padding-top: 14px;
}
.point-label {
  font-size: 10px;
  vertical-align: middle;
}
.point {
  margin-left: 5px;
  font-size: 15px;
  font-weight: 600;
  vertical-align: middle;
}
.icon-right {
  right: 10px;
  position: absolute;
}
</style>
