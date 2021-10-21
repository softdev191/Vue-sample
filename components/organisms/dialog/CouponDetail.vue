<template>
  <BaseDialog
    ref="dialog"
    title=""
    :has-ok="false"
    cancel-text="閉じる"
    @cancel="handleCancel"
    @close="handleCancel"
  >
    <template v-if="coupon">
      <div class="dialog-section">
        <div class="coupon-title">{{ coupon.name }}</div>
        <div class="coupon-discount">値引き : {{ coupon.discount_text }}</div>
        <div v-if="coupon.start_dt && coupon.end_dt" class="coupon-available">
          利用可能期間 :{{ formatDate(coupon.start_dt) }}〜{{
            formatDate(coupon.end_dt)
          }}
        </div>
        <div v-else-if="coupon.start_dt" class="coupon-available">
          利用可能期間 :{{ formatDate(coupon.start_dt) }}から
        </div>
        <div v-else-if="coupon.end_dt" class="coupon-available">
          利用可能期間 :{{ formatDate(coupon.end_dt) }}まで
        </div>
      </div>
      <div class="dialog-section">
        <div class="dialog-section-title">利用条件</div>
        <div class="dialog-section-content">
          {{ coupon.usage_condition }}
        </div>
      </div>
      <div class="dialog-section">
        <div class="dialog-section-title">説明</div>
        <div class="dialog-section-content">
          {{ coupon.description }}
        </div>
      </div>
    </template>
  </BaseDialog>
</template>

<script>
import dayjs from "dayjs";
import BaseDialog from "@/components/atoms/BaseDialog";

export default {
  components: {
    BaseDialog,
  },
  data() {
    return {
      coupon: null,
    };
  },
  methods: {
    open({ coupon }) {
      this.coupon = coupon;
      this.$refs.dialog.show();
    },
    close() {
      this.$refs.dialog.hide();
      this.coupon = null;
    },
    formatDate(dateString) {
      if (!dateString) {
        return "";
      }

      return dayjs(dateString).format("YYYY/MM/DD HH:mm");
    },
    handleCancel() {
      this.close();
    },
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
</style>
