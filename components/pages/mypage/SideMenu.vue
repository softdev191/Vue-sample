<template>
  <div class="side-menu-wrapper">
    <div class="side-menu">
      <div class="side-menu-section">
        <div class="side-menu-title">会員メニュー</div>
        <div class="side-menu-list">
          <div class="side-menu-item">
            <NuxtLink
              to="/mypage"
              class="side-menu-link"
              @click.native="screenTopMove()"
              >マイページトップ</NuxtLink
            >
          </div>
          <div class="side-menu-item">
            <NuxtLink
              to="/mypage/coupons"
              class="side-menu-link"
              @click.native="screenTopMove()"
            >
              クーポン一覧
            </NuxtLink>
            <span v-if="validCouponCount > 0" class="badge">
              {{ validCouponCount }}
            </span>
          </div>
          <div class="side-menu-item">
            <NuxtLink
              to="/mypage/point-history"
              class="side-menu-link"
              @click.native="screenTopMove()"
            >
              ポイント履歴
            </NuxtLink>
          </div>
          <div class="side-menu-item">
            <NuxtLink
              to="/mypage/purchase-history"
              class="side-menu-link"
              @click.native="screenTopMove()"
            >
              購入履歴・発送状況・キャンセル
            </NuxtLink>
          </div>
          <div class="side-menu-item">
            <NuxtLink
              to="/mypage/favorites"
              class="side-menu-link"
              @click.native="screenTopMove()"
            >
              お気に入りした商品
            </NuxtLink>
          </div>
        </div>
      </div>
      <div class="side-menu-section">
        <div class="side-menu-title">ご登録内容の確認・変更</div>
        <div class="side-menu-list">
          <div class="side-menu-item">
            <NuxtLink
              to="/mypage/change/member"
              class="side-menu-link"
              @click.native="screenTopMove()"
            >
              会員情報の変更
            </NuxtLink>
          </div>
          <div class="side-menu-item">
            <NuxtLink
              to="/mypage/change/email"
              class="side-menu-link"
              @click.native="screenTopMove()"
            >
              メールアドレスの変更
            </NuxtLink>
          </div>
          <div class="side-menu-item">
            <NuxtLink
              to="/mypage/change/password"
              class="side-menu-link"
              @click.native="screenTopMove()"
            >
              パスワードの変更
            </NuxtLink>
          </div>
          <div class="side-menu-item">
            <NuxtLink
              to="/mypage/change/destination"
              class="side-menu-link"
              @click.native="screenTopMove()"
            >
              お届け先の登録・変更手続き
            </NuxtLink>
          </div>
          <div class="side-menu-item">
            <NuxtLink
              to="/mypage/change/mail-magazine"
              class="side-menu-link"
              @click.native="screenTopMove()"
            >
              メルマガとDMの登録・停止
            </NuxtLink>
          </div>
          <div class="side-menu-item">
            <NuxtLink
              to="/mypage/change/withdraw"
              class="side-menu-link"
              @click.native="screenTopMove()"
            >
              退会をご希望の方
            </NuxtLink>
          </div>
          <div class="side-menu-item">
            <a href="#" class="side-menu-link" @click="logout">ログアウト</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { CartCredentialProvider } from "~/plugins/storage-provider/cart-credential";
export default {
  computed: {
    ...mapState({
      validCouponCount(state, getters) {
        return getters["coupon/validCoupons"]
          ? getters["coupon/validCoupons"].length
          : 0;
      },
    }),
  },
  methods: {
    async logout() {
      this.$amazonPay.logout();

      await this.$auth.logout().then(() => {
        // Amazon Payでログインすると$router.pushのが効かなくなるので強制的にリダイレクトさせる。
        if (this.$route.name !== "login") {
          window.location.href = "/login";
        }
      });

      CartCredentialProvider.clear();
    },
    screenTopMove() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  },
};
</script>

<style lang="scss" scoped>
.side-menu-wrapper {
  width: 180px;
  margin-right: 50px;
  @include touch {
    width: 100%;
    margin-right: 0;
  }
  .side-menu {
    .side-menu-section {
      margin-bottom: 30px;
      .side-menu-title {
        font-size: 12px;
        line-height: 1;
        font-weight: 600;
        padding: 6px 5px;
        border-bottom: 1px solid $black;
        @include touch {
          font-size: 14px;
          text-align: center;
          padding: 50px 0 30px;
        }
      }
    }
  }
  .side-menu-list {
    .side-menu-item {
      position: relative;
      font-size: 10px;
      line-height: 1;
      padding: 12px 5px;
      border-bottom: 1px solid $middle-gray;
      @include touch {
        font-size: 14px;
        padding: 15px 5px;
        &::after {
          content: "";
          position: absolute;
          right: 5px;
          top: 22px;
          border: solid black;
          border-width: 0 1px 1px 0;
          display: inline-block;
          padding: 4px;
          transform: rotate(-45deg);
          -webkit-transform: rotate(-45deg);
        }
      }
    }
    .side-menu-link {
      color: $black;
    }
    .badge {
      position: absolute;
      right: 0;
      top: 10px;
      display: block;
      width: 15px;
      height: 15px;
      background-color: $black;
      color: $white;
      font-size: 8px;
      border-radius: 50%;
      @include touch {
        display: inline-block;
        position: static;
      }
    }
  }
}
</style>
