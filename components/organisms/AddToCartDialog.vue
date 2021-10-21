<template>
  <BaseDialog
    ref="putItemDialog"
    title="カートに入れる"
    :has-cancel="false"
    :has-ok="false"
  >
    <div v-if="isOpen">
      <div>
        <div v-if="error" class="columns is-mobile cart-row-error">
          <p class="error">{{ error.message }}</p>
        </div>
        <div
          v-for="(detail, index) in item.item_details"
          :key="index"
          class="columns is-mobile cart-row"
        >
          <div class="column is-2">
            <ItemImage :item-image="detail.item_image" size="s" />
          </div>
          <div class="column is-5 has-text-centered">
            <div>
              {{
                `${detail.color_id} ${detail.color.display_name} ${detail.size.name}`
              }}
            </div>
            <div>
              {{ getEcStockLabel(detail) }}
            </div>
          </div>
          <div class="column is-5">
            <ItemButton
              class="c-list-button"
              :item-detail="detail"
              :cartPending="cartPending"
              @click="onAddtoCart(item.product_number, detail)"
            />
          </div>
          <div
            v-if="
              cartError.isShow && Number(cartError.id) === Number(detail.id)
            "
            class="error"
            v-html="cartError.message"
          ></div>
        </div>
      </div>
    </div>
  </BaseDialog>
</template>

<script>
import BaseDialog from "@/components/atoms/BaseDialog";
import ItemButton from "@/components/atoms/ItemButton";
import ItemImage from "@/components/atoms/ItemImage";
import addToCartMixin from "@/components/organisms/mixins/addToCartMixin";

export default {
  name: "AddToCartDialog",
  emits: ["addToCart"],
  components: {
    BaseDialog,
    ItemImage,
    ItemButton,
  },
  mixins: [addToCartMixin],
  props: {
    item: {
      type: Object,
      required: true,
    },
    cartError: {
      type: Object,
      default: () => ({ isShow: false }),
    },
    error: {
      type: Object,
      default: null,
    },
    cartPending: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    show() {
      this.isOpen = true;
      this.$refs.putItemDialog.show();
    },
    hide() {
      this.$refs.putItemDialog.hide();
      this.isOpen = false;
      this.$emit("close");
    },
    onAddtoCart(productNumber, itemDetail) {
      this.$emit("addToCart", productNumber, itemDetail);
    },
  },
};
</script>

<style lang="scss" scoped>
.cart-row {
  flex-wrap: wrap;
  border-bottom: 1px solid #dbdbdb;
  &:first-child {
    border-top: 1px solid #dbdbdb;
  }
}
.cart-row-error {
  flex-wrap: wrap;
  border-bottom: 1px solid #dbdbdb;
}
.c-list-button.wrap {
  margin-top: 10px;
  margin-bottom: 0;

  &.redispaly-requested {
    &::v-deep {
      .button {
        color: #000;
      }
    }
  }
}
.error {
  text-align: center;
  width: 100%;
  color: $error;
  margin-top: -11px;
  margin-bottom: 3px;
}
</style>
