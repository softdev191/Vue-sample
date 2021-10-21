<template>
  <div class="order-right-section">
    <div class="order-cart-section">
      <div class="order-sum-row">
        <div class="order-sum-label">
          <span class="big">合計</span>
          <span class="small">（税込）</span>
        </div>
        <div class="order-sum-value">{{ yen(totalCost) }}</div>
      </div>
      <div class="full-divider"></div>
      <ReturnPoints
        v-if="showAddPoint && $auth.loggedIn"
        :return-points="returnPoints"
      />
      <ButtonWrapper theme="full">
        <ButtonLink to="/cart" theme="light">カートを見る</ButtonLink>
      </ButtonWrapper>
    </div>
    <div class="form-group mt30">
      <ConfirmButton
        :disabled="confirmDisabled"
        @click="$emit('confirm')"
      ></ConfirmButton>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ConfirmButton from "@/components/atoms/order/ConfirmButton";
import ReturnPoints from "@/components/molecules/ReturnPoints";
import { yen } from "@/utils/format";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import ButtonLink from "@/components/atoms/ButtonLink";

export default {
  components: {
    ConfirmButton,
    ReturnPoints,
    ButtonWrapper,
    ButtonLink,
  },
  props: {
    confirmDisabled: {
      type: Boolean,
      default: false,
    },
    showAddPoint: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapGetters({
      totalCost: "cart/totalCost",
      returnPoints: "cart/returnPoints",
      user: "user",
      cart: "cart/cart",
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
.order-right-section {
  .order-cart-section {
    padding: 30px 15px;
    background: #f6f6f6;
    .order-sum-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 1;
      padding-bottom: 10px;
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
        font-size: 18px;
        font-weight: 600;
      }
    }
  }
}
</style>
