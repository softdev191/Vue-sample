export default {
  computed: {
    cartStatuses() {
      return this.$store.getters["master/enums"].cart__status;
    },
    cartStatusEnum() {
      return this.cartStatuses.reduce((obj, { key, value }) => {
        return Object.assign(obj, { [key]: value });
      }, {});
    },
    cartStatusLabels() {
      return this.cartStatuses.reduce((labels, status) => {
        return Object.assign(labels, { [status.value]: status.label });
      }, {});
    },
    redisplayRequestedSku() {
      return this.$store.getters["redisplayRequest/dict"];
    },
  },
  methods: {
    getEcStockLabel(itemDetail) {
      const cartStatusEnum = this.cartStatusEnum;

      switch (itemDetail.applicable_cart_status) {
        case cartStatusEnum.Add:
          return itemDetail.is_almost_ec_stock ? "残りわずか" : "在庫あり";
        case cartStatusEnum.Reserve:
          return itemDetail.is_almost_out_of_reservable_stock
            ? "予約 : 残りわずか"
            : "予約";
        case cartStatusEnum.Order:
          return "取り寄せ";
        case cartStatusEnum.RestockRequest:
          return "在庫なし";
        default:
          return "在庫なし";
      }
    },
    getCartButtonLabel(itemDetail, itemIsSoldOut) {
      if (itemIsSoldOut) return "SOLD OUT";
      const cartStatusEnum = this.cartStatusEnum;

      switch (itemDetail.applicable_cart_status) {
        case cartStatusEnum.Add:
        case cartStatusEnum.Reserve:
        case cartStatusEnum.Order:
          return "カートに入れる";
        case cartStatusEnum.RestockRequest:
          return this.isRedisplayRequested(itemDetail)
            ? "再入荷リクエスト停止"
            : "再入荷リクエスト";
        default:
          return "SOLD OUT";
      }
    },
    isRedisplayRequested(itemDetail) {
      return this.redisplayRequestedSku[itemDetail.id] !== undefined;
    },
    getCartButtonCss(itemDetail) {
      if (this.isRedisplayRequested(itemDetail)) {
        return "redispaly-requested";
      }

      return "";
    },
    getButtonTheme(itemDetail) {
      const cartStatusEnum = this.cartStatusEnum;

      switch (itemDetail.applicable_cart_status) {
        case cartStatusEnum.Add:
        case cartStatusEnum.Reserve:
        case cartStatusEnum.Order:
          return "dark";
        case cartStatusEnum.RestockRequest:
          return this.isRedisplayRequested(itemDetail) ? "gray" : "light";
        default:
          return "light";
      }
    },
    isDisabled(itemDetail, itemIsSoldOut) {
      if (itemIsSoldOut || this.isSoldOut(itemDetail)) {
        return true;
      }

      return false;
    },
    isSoldOut(itemDetail) {
      return (
        Number(itemDetail.applicable_cart_status) ===
        Number(this.cartStatusEnum.SoldOut)
      );
    },
    convertStatusButtonLabel(itemDetail) {
      const applicableCartStatus = Number(itemDetail.applicable_cart_status);
      const cartStatus = this.cartStatuses.find(
        (cartStatus) => cartStatus.value === applicableCartStatus
      );
      return cartStatus.label;
    },
  },
};
