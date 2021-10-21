<template>
  <div class="payment-section">
    <div class="order-sum-row">
      <div class="order-sum-label">
        <span class="big">合計</span>
        <span class="small">（税込）</span>
      </div>
      <div class="order-sum-value">{{ yen(totalCost) }}</div>
    </div>
    <div class="full-divider pc-only"></div>
    <ReturnPoints
      v-if="$auth.loggedIn"
      class="pc-only"
      :return-points="returnPoints"
    />
    <div class="form-group mt30 mt0-pc">
      <ButtonWrapper theme="full">
        <Button
          theme="dark"
          :disabled="hasNoItems"
          :pending="pending"
          @click="purchase"
        >
          購入手続きへ
        </Button>
      </ButtonWrapper>
    </div>
    <div v-show="$amazonPay.isAmazonLoginReady" class="form-group">
      <client-only>
        <AmazonPayButton v-show="!hasNoItems" class="amazon-pay-button" />
        <ButtonWrapper theme="full">
          <Button v-show="hasNoItems" theme="dark" :disabled="true">
            Amazon Pay で支払う
          </Button>
        </ButtonWrapper>
      </client-only>
      <p class="form-text">
        Amazon.co.jpにご登録の情報を利用してログインまたは会員登録されるお客さまは「Amazon
        Payで支払う」ボタンよりお進みください。
      </p>
    </div>
    <div
      v-if="!isReserved && !isBackOrdered && !$auth.loggedIn"
      class="form-group mb0-pc"
    >
      <ButtonWrapper theme="full">
        <ButtonLink
          to="/cart/guest-order/email"
          :disabled="hasNoItems"
          theme="light"
        >
          会員登録せず購入
        </ButtonLink>
      </ButtonWrapper>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { yen } from "@/utils/format";
import AmazonPayButton from "@/components/atoms/AmazonPayButton";
import ReturnPoints from "@/components/molecules/ReturnPoints";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";
import ButtonLink from "@/components/atoms/ButtonLink";

export default {
  components: {
    AmazonPayButton,
    ReturnPoints,
    ButtonWrapper,
    Button,
    ButtonLink,
  },
  data() {
    return {
      couponShow: false,
      couponId: undefined,
    };
  },
  mounted() {
    this.$store.commit("common/pending", false);
  },
  computed: {
    ...mapGetters({
      totalCost: "cart/totalCost",
      returnPoints: "cart/returnPoints",
      hasNoItems: "cart/hasNoItems",
      isReserved: "cart/isReserved",
      isBackOrdered: "cart/isBackOrdered",
      pending: "common/pending",
    }),
  },
  methods: {
    yen(...args) {
      return yen(...args);
    },
    purchase() {
      this.$store.commit("common/pending", true);
      if (!this.$auth.loggedIn) {
        this.$store.commit("route/setRedirectPath", this.$route);
        this.$router.push("/login");
        this.$store.commit("common/pending", false);
      } else {
        this.$router.push("/cart/order");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.payment-section {
  .order-sum-row {
    display: none;
    @include desktop {
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 1;
      padding: 0 0 10px;
    }
    .order-sum-label {
      .big {
        font-size: 14px;
      }
      .small {
        font-size: 10px;
      }
    }
    .order-sum-value {
      color: $error;
      font-size: 14px;
      font-weight: 600;
      @include desktop {
        font-size: 18px;
      }
    }
  }
}
.amazon-pay-button {
  text-align: center;
}
</style>
