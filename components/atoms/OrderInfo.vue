<template>
  <div :class="divClass">
    <p class="order-info-row mb10">
      <span class="order-info-label">商品合計</span>
      <span class="order-info-value">{{ yen(orderInfo.products_cost) }}</span>
    </p>
    <p v-if="orderInfo.campaign_reduce > 0" class="order-info-row mb10">
      <span class="order-info-label">キャンペーン割引</span>
      <span class="order-info-value"
        >-{{ yen(orderInfo.campaign_reduce) }}</span
      >
    </p>
    <p v-if="orderInfo.coupon_discount > 0" class="order-info-row mb10">
      <span class="order-info-label">クーポン割引</span>
      <span class="order-info-value"
        >-{{ yen(orderInfo.coupon_discount) }}</span
      >
    </p>
    <p v-if="orderInfo.employee_discount > 0" class="order-info-row mb10">
      <span class="order-info-label">社員割引</span>
      <span class="order-info-value"
        >-{{ yen(orderInfo.employee_discount) }}</span
      >
    </p>
    <p class="order-info-row mb10">
      <span class="order-info-label">送料</span>
      <span class="order-info-value">{{ yen(orderInfo.transfer_cost) }}</span>
    </p>
    <div class="full-divider"></div>
    <div class="order-sum-row mt10 mb10">
      <div class="order-sum-label">
        <span class="big">合計</span>
        <span class="small">（税込）</span>
      </div>
      <div class="order-sum-value red">{{ yen(totalCost) }}</div>
    </div>
    <div class="full-divider"></div>
    <template v-if="$auth.loggedIn">
      <ReturnPoints
        v-if="showAddPoint"
        :return-points="returnPoints"
        display="sp"
        class="mt10 mb10"
      />
      <div v-if="showAddPoint" class="full-divider"></div>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { yen } from "@/utils/format";
import ReturnPoints from "@/components/molecules/ReturnPoints";

export default {
  components: {
    ReturnPoints,
  },
  props: {
    divClass: {
      type: String,
      default: "order-info-wrapper",
    },
    showAddPoint: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapState({
      orderInfo(state, getters) {
        return getters["cart/orderInfo"];
      },
      totalCost(state, getters) {
        return getters["cart/totalCost"];
      },
      returnPoints(state, getters) {
        return getters["cart/returnPoints"];
      },
    }),
  },
  methods: {
    yen(...args) {
      return yen(...args);
    },
  },
};
</script>
<style lang="scss" scoped>
.order-info-row {
  display: flex;
  .order-info-label {
    width: 50%;
    display: inline-block;
  }
  .order-info-value {
    width: 50%;
    text-align: right;
    display: inline-block;
  }
}
.order-sum-row {
  display: flex;
  .order-sum-label {
    width: 50%;
    display: inline-block;
  }
  .order-sum-value {
    width: 50%;
    text-align: right;
    display: inline-block;
  }
  .red {
    color: #b23838;
    font-size: 14px;
    font-weight: 600;
  }
}
</style>
