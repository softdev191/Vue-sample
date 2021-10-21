<template>
  <div class="order-return-row" :class="css">
    <div class="order-return-label" :class="css">付与予定ポイント</div>
    <div class="order-return-value" :class="css">
      {{ returnPoints }}ポイント
      <InformationMessage
        :show-text="false"
        class="point-message"
        dialog-title="付与予定ポイント"
      >
        <template v-slot:message>
          ・YAMADAYA会員のポイントです。<br />
          ・YAMADAYA会員のポイントは、商品のご購入の際に、１ポイント＝１円としてご利用いただくことができます。<br />
          ・お客さまが購入を完了し、商品の発送が完了したタイミングでお客様にポイントが付与されます。<br />
          ・クーポン利用やポイント利用等の変更によって付与ポイント数は変動する為、「付与予定」ポイントとなっています。<br />
        </template>
      </InformationMessage>
    </div>
  </div>
</template>

<script>
import InformationMessage from "@/components/molecules/InformationMessage";

export default {
  components: {
    InformationMessage,
  },
  props: {
    returnPoints: {
      type: Number,
      default: 0,
    },
    display: {
      type: String,
      default: "pc",
    },
  },
  computed: {
    css() {
      return this.display;
    },
  },
};
</script>

<style lang="scss" scoped>
.order-return-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 1;
  &.pc {
    padding-top: 10px;
    padding-bottom: 30px;
  }
  .order-return-label {
    font-size: 10px;
    &.sp {
      font-size: 12px;
    }
  }
  .order-return-value {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    &.sp {
      font-size: 12px;
    }
    .point-message {
      margin-left: 5px;
    }
  }
}
</style>
