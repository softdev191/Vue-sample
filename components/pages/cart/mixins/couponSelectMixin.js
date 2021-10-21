import { mapGetters } from "vuex";
import { extractFlatValidationError } from "@/plugins/vee-validate";
import { createDict } from "@/utils/object";

export default {
  data() {
    return {
      error: null,
      pending: {},
    };
  },
  props: {
    /**
     * チェックボックス選択後に即時反映するか。
     * falseの場合、`update` イベントを発行する。
     */
    immediateMode: {
      type: Boolean,
      default: true,
    },
    useCouponIds: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapGetters({
      uncombinableAvailableCoupons: "cart/uncombinableAvailableCoupons",
      combinableAvailableCoupons: "cart/combinableAvailableCoupons",
    }),
    useCouponIdDict() {
      return createDict(this.useCouponIds);
    },
    uncombinableAvailableCouponDict() {
      return createDict(this.uncombinableAvailableCoupons);
    },
    pendingAny() {
      const pending = this.pending;
      return Object.keys(pending).some((key) => pending[key]);
    },
  },
  watch: {
    error(value) {
      this.$emit("error", value);
    },
  },
  methods: {
    async handleCheckUncombinable(coupon) {
      if (this.pendingAny) {
        return;
      }

      try {
        const useCouponIds = this.useCouponIds;
        const tagetId = coupon.id;
        this.$set(this.pending, tagetId, true);

        const mergedUseCouponIds = this.mergeUncombinable(
          useCouponIds,
          tagetId
        );

        await this.updateUseCouponIds(mergedUseCouponIds);
      } catch (error) {
        console.error(error);
      } finally {
        this.$set(this.pending, coupon.id, false);
        this.resetCheckedCache();
      }
    },

    async handleUncheckUncombinable(coupon) {
      if (this.pendingAny) {
        return;
      }

      try {
        const tagetId = Number(coupon.id);
        this.$set(this.pending, coupon.id, true);
        const useCouponIds = this.useCouponIds.filter(
          (id) => Number(id) !== tagetId
        );
        await this.updateUseCouponIds(useCouponIds);
      } catch (error) {
        console.error(error);
      } finally {
        this.$set(this.pending, coupon.id, false);
        this.resetCheckedCache();
      }
    },

    async handleCheckCombinable(coupon) {
      if (this.pendingAny) {
        return;
      }

      try {
        this.$set(this.pending, coupon.id, true);
        const tagetId = coupon.id;
        const useCouponIds = this.useCouponIds;

        const mergedUseCouponIds = useCouponIds.includes(tagetId)
          ? [...useCouponIds]
          : useCouponIds.concat(tagetId);

        await this.updateUseCouponIds(mergedUseCouponIds);
      } catch (error) {
        console.error(error);
      } finally {
        this.$set(this.pending, coupon.id, false);
        this.resetCheckedCache();
      }
    },

    filterUncombinable(useCouponIds) {
      if (useCouponIds.length < 2) {
        return useCouponIds;
      }

      const dict = this.uncombinableAvailableCouponDict;

      return useCouponIds.filter((id) => dict[id] === undefined);
    },

    mergeUncombinable(useCouponIds, couponId) {
      if (useCouponIds.length === 0) {
        return [couponId];
      }

      const dict = this.uncombinableAvailableCouponDict;

      return useCouponIds
        .filter((id) => dict[id] === undefined)
        .concat(couponId);
    },

    validateUncombinable(useCouponIds) {
      if (useCouponIds.length < 2) {
        return useCouponIds;
      }

      const dict = this.uncombinableAvailableCouponDict;
      let hasUncombinable = false;

      for (let i = 0; i < useCouponIds.length; i++) {
        if (dict[useCouponIds[i]] !== undefined) {
          if (hasUncombinable) {
            this.error = {
              title: "適用クーポンの更新ができませんでした。",
              message: "併用不可クーポンは複数ご利用になれません。",
            };

            throw new Error("併用不可クーポンは複数ご利用になれません。");
          }

          hasUncombinable = true;
        }
      }

      return useCouponIds;
    },

    async handleUncheckCombinable(coupon) {
      if (this.pendingAny) {
        return;
      }

      try {
        this.$set(this.pending, coupon.id, true);
        const tagetId = Number(coupon.id);
        const useCouponIds = this.useCouponIds.filter(
          (id) => Number(id) !== tagetId
        );
        await this.updateUseCouponIds(useCouponIds);
      } catch (error) {
        console.error(error);
      } finally {
        this.$set(this.pending, coupon.id, false);
        this.resetCheckedCache();
      }
    },

    resetCheckedCache() {
      this.$refs.coupons.forEach((component) => {
        component.resetChecked();
      });
    },

    async updateUseCouponIds(useCouponIds) {
      try {
        if (this.immediateMode) {
          await this.$store.dispatch("cart/changeUseCoupons", { useCouponIds });
        } else {
          this.$emit("update", useCouponIds);
        }

        this.error = null;
      } catch (error) {
        const messages = extractFlatValidationError(error);

        this.error = {
          title: "適用クーポンの更新ができませんでした。",
          message: messages[0],
        };

        throw error;
      }
    },
  },
};
