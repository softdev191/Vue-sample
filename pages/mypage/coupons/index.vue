<template>
  <div class="fixed-container">
    <Breadcrumb text="HOME > マイページ > クーポン一覧" />
    <div class="mypage-layout">
      <SideMenu />
      <div class="mypage-main">
        <PageTitle>クーポン一覧</PageTitle>
        <section class="coupons-section">
          <div class="section-title">取得できるクーポン</div>
          <div class="section-content">
            <div class="coupon-list-wrapper">
              <ul class="coupon-list">
                <li
                  v-for="(coupon, index) in validCoupons"
                  :key="index"
                  class="coupon-list-item"
                >
                  <div class="coupon-item">
                    <div class="coupon-title">{{ coupon.name }}</div>
                    <div class="coupon-discount">
                      値引き : {{ coupon.discount_text }}
                    </div>
                    <div class="coupon-available">
                      利用可能期間 :&nbsp;
                      {{ coupon.start_dt | date }}〜{{ coupon.end_dt | date }}
                    </div>
                    <button class="btn inline" @click="issue(coupon)">
                      発行する
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section class="coupons-section">
          <div class="section-title">所持しているクーポン</div>
          <div class="section-content">
            <div class="coupon-list-wrapper">
              <ul class="coupon-list">
                <li
                  v-for="(coupon, index) in myCoupons"
                  :key="index"
                  class="coupon-list-item"
                >
                  <div class="coupon-item">
                    <div class="coupon-title">{{ coupon.name }}</div>
                    <div class="coupon-discount">
                      値引き : {{ coupon.discount_text }}
                    </div>
                    <div class="coupon-available">
                      利用可能期間 :{{ coupon.start_dt | date }}〜{{
                        coupon.end_dt | date
                      }}
                    </div>
                    <span class="q-icon" @click="showDetail(coupon)">
                      <img src="@/assets/images/info-icon.png" alt="" />
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
    <BaseDialog
      ref="couponDetailDialog"
      title=""
      :has-ok="false"
      cancel-text="閉じる"
      @cancel="onCloseDetail"
    >
      <template v-if="couponDetail">
        <div class="dialog-section">
          <div class="coupon-title">{{ couponDetail.name }}</div>
          <div class="coupon-discount">
            値引き : {{ couponDetail.discount_text }}
          </div>
          <div class="coupon-available">
            利用可能期間 :{{ couponDetail.start_dt | date }}〜{{
              couponDetail.end_dt | date
            }}
          </div>
        </div>
        <div class="dialog-section">
          <div class="dialog-section-title">利用条件</div>
          <div class="dialog-section-content">
            {{ couponDetail.usage_condition }}
          </div>
        </div>
        <div class="dialog-section">
          <div class="dialog-section-title">説明</div>
          <div class="dialog-section-content">
            {{ couponDetail.description }}
          </div>
        </div>
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import PageTitle from "@/components/atoms/PageTitle";
import BaseDialog from "@/components/atoms/BaseDialog";
import Breadcrumb from "@/components/partials/Breadcrumb";
import SideMenu from "@/components/pages/mypage/SideMenu";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default {
  components: {
    PageTitle,
    BaseDialog,
    Breadcrumb,
    SideMenu,
  },
  async fetch({ store }) {
    await store.dispatch("coupon/fetch");
  },
  data() {
    return {
      stores: [],
      products: [],
      couponIssue: undefined,
      couponDetail: undefined,
    };
  },
  computed: {
    ...mapState({
      validCoupons(state, getters) {
        return getters["coupon/validCoupons"];
      },
      myCoupons(state, getters) {
        return getters["coupon/myCoupons"];
      },
    }),
    faChevronRight() {
      return faChevronRight;
    },
  },
  methods: {
    issue(coupon) {
      this.$store.dispatch("coupon/setIssueCoupon", coupon);
      this.$router.push("/mypage/coupons/issue");
    },
    showDetail(coupon) {
      this.couponDetail = coupon;
      this.$refs.couponDetailDialog.show();
    },
    onCloseDetail() {
      this.$refs.couponDetailDialog.hide();
    },
  },
  head() {
    return {
      title: "クーポン一覧",
    };
  },
};
</script>

<style lang="scss" scoped>
.dialog-section {
  margin-bottom: 12px;
  > .dialog-section-title {
    font-size: 10px;
    font-weight: 600;
  }
  > .dialog-section-content {
    font-size: 10px;
  }
  .coupon-title {
    font-size: 12px;
    font-weight: 600;
  }
  .coupon-discount {
    font-size: 12px;
  }
  .coupon-available {
    font-size: 10px;
  }
  .link {
    border-bottom: 1px solid $black;
  }
}
.coupons-section {
  .section-title {
    font-size: 14px;
    border-bottom: 1px solid $black;
    padding: 0 5px;
    margin: 0 -5px 20px;
  }
  .section-content {
    .coupon-list-wrapper {
      .coupon-list {
        .coupon-list-item {
          > .coupon-item {
            position: relative;
            border-bottom: 1px solid $middle-gray;
            margin: 0 -5px 16px;
            padding: 0 5px 12px;
            > .coupon-title {
              font-size: 12px;
              font-weight: 600;
              margin-bottom: 4px;
            }
            > .coupon-discount {
              font-size: 12px;
              margin-bottom: 4px;
            }
            > .coupon-available {
              font-size: 10px;
              margin-bottom: 4px;
            }
            > .btn {
              position: absolute;
              right: 5px;
              bottom: 12px;
              width: 100px;
              font-size: 10px;
              line-height: 1;
              padding: 10px;
              border: 1px solid $black;
              background-color: $middle-gray;
            }
            > .q-icon {
              position: absolute;
              right: 5px;
              bottom: 12px;
              display: block;
              width: 16px;
              height: 16px;
            }
          }
        }
      }
    }
  }
}
</style>
