<template>
  <div class="coupon-component">
    <div class="dropdown-section sp-only">
      <div class="dropdown-section-header" @click="toggleOrder">
        注文内容
        <fa
          :icon="faChevronDown"
          class="angle-down"
          :class="{ rotate: orderShow }"
        />
      </div>
      <transition
        name="dropdown"
        @before-enter="beforeEnter"
        @enter="enter"
        @before-leave="beforeLeave"
        @leave="leave"
      >
        <div v-show="orderShow" class="dropdown-section-content">
          <order-info
            :div-class="`dropdown-section-content-inner`"
          ></order-info>
        </div>
      </transition>
    </div>
    <div class="order-section pc-only">
      <div class="order-table-wrapper">
        <div class="order-table-header">注文内容</div>
        <table class="order-table">
          <tbody>
            <tr>
              <th class="order-title">商品合計</th>
              <td class="order-cost">{{ yen(order.products_cost) }}</td>
            </tr>
            <tr v-if="order.campaign_reduce > 0">
              <th class="order-title">キャンペーン割引</th>
              <td class="order-cost">-{{ yen(order.campaign_reduce) }}</td>
            </tr>
            <tr v-if="order.coupon_discount > 0">
              <th class="order-title">クーポン割引</th>
              <td class="order-cost">-{{ yen(order.coupon_discount) }}</td>
            </tr>
            <tr v-if="order.employee_discount > 0">
              <th class="order-title">社員割引</th>
              <td class="order-cost">-{{ yen(order.employee_discount) }}</td>
            </tr>
            <tr>
              <th class="order-title">送料</th>
              <td class="order-cost">{{ yen(order.transfer_cost) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import OrderInfo from "@/components/atoms/OrderInfo";
import { yen } from "@/utils/format";

export default {
  components: {
    OrderInfo,
  },
  data() {
    return {
      orderShow: false,
    };
  },
  computed: {
    ...mapState({
      order(state, getters) {
        return getters["cart/orderInfo"];
      },
    }),
    faChevronDown() {
      return faChevronDown;
    },
  },
  methods: {
    yen(...args) {
      return yen(...args);
    },
    toggleOrder() {
      this.orderShow = !this.orderShow;
    },
    beforeEnter(el) {
      el.style.height = "0";
    },
    enter(el) {
      el.style.height = el.scrollHeight + "px";
    },
    beforeLeave(el) {
      el.style.height = el.scrollHeight + "px";
    },
    leave(el) {
      el.style.height = "0";
    },
  },
};
</script>

<style lang="scss" scoped>
.dropdown-section {
  .dropdown-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    line-height: 1;
    padding: 16px 0;
    .angle-down {
      transition-duration: 0.3s;
    }
    .rotate {
      transform: rotate(180deg);
    }
  }
  .dropdown-section-content {
    transition: 150ms ease-out;
    .dropdown-section-content-inner {
      transition: 150ms ease-out;
    }
  }
}
.order-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}
.order-sum-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 1;
  padding: 16px 0;
  @include desktop {
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
.order-extra-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 1;
  padding: 16px 0;
  @include desktop {
    padding: 10px 0 30px;
  }
  .order-extra-label {
    font-size: 10px;
  }
  .order-extra-value {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
  }
}
.order-table-wrapper {
  display: flex;
  padding: 10px 0;
  .order-table-header {
    width: 135px;
    font-size: 14px;
    padding: 5px 0;
  }
  .order-table {
    flex: 1;
    th,
    td {
      font-weight: 400;
      padding: 5px 0;
      vertical-align: middle;
    }
    .order-title {
      font-size: 12px;
    }
    .order-cost {
      font-size: 12px;
      text-align: right;
    }
  }
}
</style>
