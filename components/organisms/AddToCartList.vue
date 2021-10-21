<template>
  <ul class="product-class-list">
    <li v-for="(detail, index) in item.item_details" :key="index">
      <div class="item-wrapper">
        <div class="class-image">
          <ItemImage :item-image="detail.item_image" size="s" />
        </div>
        <div class="class-info">
          <h5>
            {{
              `${detail.color_id} ${detail.color.display_name} ${detail.size.name}`
            }}
          </h5>
          <p class="stock-status">
            {{ getEcStockLabel(detail) }}
          </p>
        </div>
        <div class="class-action">
          <ItemButton
            class="item-class-btn"
            :item-detail="detail"
            :cartPending="cartPending"
            @click="onAddtoCart(item.product_number, detail)"
          />
        </div>
      </div>
      <div
        v-if="error.isShow && Number(error.id) === Number(detail.id)"
        class="error"
        v-html="error.message"
      ></div>
    </li>
  </ul>
</template>

<script>
import addToCartMixin from "@/components/organisms/mixins/addToCartMixin";
import ItemButton from "@/components/atoms/ItemButton";
import ItemImage from "@/components/atoms/ItemImage";

export default {
  name: "AddToCartList",
  emits: ["addToCart"],
  components: {
    ItemButton,
    ItemImage,
  },
  mixins: [addToCartMixin],
  props: {
    item: {
      type: Object,
      required: true,
    },
    error: {
      type: Object,
      default: () => ({ isShow: false }),
    },
    cartPending: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onAddtoCart(productNumber, itemDetail) {
      this.$emit("addToCart", productNumber, itemDetail);
    },
  },
};
</script>

<style lang="scss" scoped>
.product-class-list {
  @include touch {
    display: none;
  }

  margin-bottom: 20px;
  > li {
    border-bottom: 1px solid #dbdbdb;
    padding: 10px 0;
    &:first-child {
      border-top: 1px solid #dbdbdb;
    }

    .item-wrapper {
      display: flex;
      align-items: center;

      .class-image {
        max-width: 60px;
        text-align: center;
        img {
          max-width: 100%;
        }
      }
      .class-info {
        flex: 1;
        padding: 0 10px;
        h5,
        p {
          font-size: 12px;
          text-align: center;
        }
      }
      .item-class-btn {
        width: 140px;
        height: 30px;
        font-size: 10px;
        text-align: center;
        line-height: 30px;
        padding: 0;

        &.redispaly-requested {
          &::v-deep {
            .button {
              color: #000;
            }
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
  }
}
</style>
