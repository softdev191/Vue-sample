<template>
  <div class="fixed-container">
    <Breadcrumb text="HOME > マイページ > クーポン一覧" />
    <div class="mypage-layout">
      <SideMenu />
      <div class="mypage-main">
        <PageTitle>{{ issueCoupon.name }}</PageTitle>
        <div class="issue-section">
          <div class="coupon-discount mb10">
            値引き : {{ issueCoupon.discount_text }}
          </div>
          <div class="coupon-available">
            利用可能期間 :{{ issueCoupon.start_dt | date }}〜{{
              issueCoupon.end_dt | date
            }}<br />
            残り利用可能回数 : {{ usageNumberRest }}回
          </div>
        </div>
        <div class="issue-section">
          <div class="issue-section-title">利用可能店舗</div>
          <div class="issue-section-content">
            <span
              v-if="issueCoupon.is_target_shop_specified"
              class="link"
              @click="showStores"
              >{{ issueCoupon.name }}対象店舗一覧<fa :icon="faChevronRight"
            /></span>
            <span v-else>全店舗</span>
          </div>
        </div>
        <div class="issue-section">
          <div class="issue-section-title">対象商品</div>
          <div class="issue-section-content">
            <span
              v-if="issueCoupon.is_target_item_specified"
              class="link"
              @click="showProducts"
              >対象商品はこちら<fa :icon="faChevronRight"
            /></span>
            <span v-else>全商品</span>
          </div>
        </div>
        <div class="issue-section">
          <div class="issue-section-title">利用条件</div>
          <div class="issue-section-content">
            <span v-if="issueCoupon.usage_condition">{{
              issueCoupon.usage_condition
            }}</span>
            <span v-else>なし</span>
          </div>
        </div>
        <div class="issue-section">
          <div class="issue-section-title">説明</div>
          <div
            class="issue-section-content"
            v-html="issueCoupon.description"
          ></div>
        </div>
        <ButtonWrapper class-name="mt24">
          <Button theme="dark" :pending="pending" @click="onIssue"
            >発行する</Button
          >
        </ButtonWrapper>
      </div>
    </div>
    <BaseDialog
      ref="couponStoresDialog"
      title="対象店舗一覧"
      :has-ok="false"
      :disabled="pending"
      cancel-text="閉じる"
      @cancel="onCloseStores"
    >
      <div class="store-list-wrapper">
        <ul class="store-list">
          <li
            v-for="(store, index) in issueCoupon.shop_data"
            :key="index"
            class="store-list-item"
          >
            {{ store.name }}
          </li>
        </ul>
      </div>
    </BaseDialog>
    <BaseDialog
      ref="couponProductsDialog"
      title="対象商品"
      :has-ok="false"
      cancel-text="閉じる"
      @cancel="onCloseProducts"
    >
      <div class="product-list-wrapper">
        <ul class="product-list">
          <li
            v-for="(product, index) in issueCoupon.items"
            :key="index"
            class="product-list-item"
          >
            <div class="product-item">
              <div class="product-image-wrapper">
                <img :src="product.image_url" alt="" />
              </div>
              <div class="product-info-wrapper">
                <p
                  v-if="product.item && product.item.brand"
                  class="product-brand"
                >
                  {{ product.item.brand.name }}
                </p>
                <p v-if="product.item" class="product-title">
                  {{ product.item.display_name }}
                </p>
                <p v-if="product.item" class="product-uuid">
                  {{ product.item.product_number }}
                </p>
                <p v-if="product.color" class="product-color">
                  カラー：{{ `${product.color.id} ${product.color.name}` }}
                </p>
                <p v-if="product.size" class="product-size">
                  サイズ：{{ product.size.name }}
                </p>
                <p v-if="product.item" class="product-cost">
                  {{ product.item.discounted_price | numberFormat }}円
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </BaseDialog>
    <BaseDialog
      ref="completeDialog"
      title=""
      :has-ok="false"
      cancel-text="閉じる"
      @cancel="onCloseComplete"
    >
      <div class="complete">
        {{ issueCoupon.name }}発行が完了しました！<br />
        引き続き買い物をお楽しみください。
      </div>
    </BaseDialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import PageTitle from "@/components/atoms/PageTitle";
import BaseDialog from "@/components/atoms/BaseDialog";
import Button from "@/components/atoms/Button";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Breadcrumb from "@/components/partials/Breadcrumb";
import SideMenu from "@/components/pages/mypage/SideMenu";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default {
  components: {
    PageTitle,
    BaseDialog,
    Breadcrumb,
    SideMenu,
    Button,
    ButtonWrapper,
  },
  computed: {
    ...mapState({
      validCoupons(state, getters) {
        return getters["coupon/validCoupons"];
      },
      myCoupons(state, getters) {
        return getters["coupon/myCoupons"];
      },
      issueCoupon(state, getters) {
        return getters["coupon/issueCoupon"];
      },
    }),
    faChevronRight() {
      return faChevronRight;
    },
    usageNumberRest() {
      return this.issueCoupon.usage_number_rest
        ? this.issueCoupon.usage_number_rest
        : 1;
    },
    pending() {
      return this.$store.getters["common/pending"];
    },
  },
  methods: {
    async onIssue() {
      this.$store.commit("common/pending", true);
      await this.$store.dispatch("coupon/issue", this.issueCoupon.id);
      this.$refs.completeDialog.show();
      this.$store.commit("common/pending", false);
    },
    showStores() {
      this.$refs.couponStoresDialog.show();
    },
    onCloseStores() {
      this.$refs.couponStoresDialog.hide();
    },
    showProducts() {
      this.$refs.couponProductsDialog.show();
    },
    onCloseProducts() {
      this.$refs.couponProductsDialog.hide();
    },
    onCloseComplete() {
      this.$refs.completeDialog.hide();
      this.$router.push("/mypage/coupons");
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
.issue-section {
  margin-bottom: 12px;
  > .issue-section-title {
    font-size: 10px;
    font-weight: 600;
  }
  > .issue-section-content {
    font-size: 10px;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  .coupon-title {
    font-size: 12px;
    font-weight: 600;
  }
  .coupon-available {
    font-size: 10px;
  }
  .link {
    border-bottom: 1px solid $black;
  }
}
.my-modal-body {
  .complete {
    text-align: center;
    font-weight: 600;
  }
}
.store-list-wrapper {
  .store-list {
    display: flex;
    flex-wrap: wrap;
    > .store-list-item {
      font-size: 10px;
      line-height: 1.2;
      flex: calc(50% - 10px);
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(2n) {
        margin-right: 0;
      }
    }
  }
}
.product-list-wrapper {
  .product-list {
    > .product-list-item {
      + .product-list-item {
        margin-bottom: 20px;
      }
      .product-item {
        display: flex;
        > .product-image-wrapper {
          width: 120px;
          margin-right: 10px;
        }
        > .product-info-wrapper {
          line-height: 1.4;
          > .product-brand {
            font-size: 10px;
            margin-bottom: 5px;
          }
          > .product-title {
            font-size: 12px;
            margin-bottom: 10px;
          }
          > .product-uuid {
            font-size: 10px;
            margin-bottom: 5px;
          }
          > .product-color {
            font-size: 10px;
          }
          > .product-size {
            font-size: 10px;
            margin-bottom: 10px;
          }
          > .product-cost {
            font-size: 14px;
            font-weight: 600;
          }
        }
      }
    }
  }
}
.mb30 {
  margin-bottom: 30px;
}
</style>
