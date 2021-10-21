<template>
  <div class="s-item columns">
    <div class="column is-5">
      <div class="s-item--title">
        <h4>{{ store.name }}</h4>
      </div>
      <div class="s-item--location">
        <div class="s-item--location--info">
          <span>{{ `${store.address1} ${store.address2}` }}</span
          ><br />
          <span>{{ store.phone_number_1 }}</span
          ><br />
          <span>{{ store.phone_number_2 }}</span>
        </div>
      </div>
    </div>
    <div class="column is-2 s-item--location--link">
      <Button :href="googleMapUrl" theme="light" tag="a" target="_blank"
        >MAP</Button
      >
    </div>
    <div class="s-item--acc column is-5">
      <div class="s-item--acc--stock columns">
        <ItemStoreListSku
          v-for="(itemDetail, index) in item.item_details"
          :key="index"
          class="column is-half s-item--acc--stock__sku"
          :item-detail-store="itemDetailStoreDict[itemDetail.id] || {}"
          :item-detail="itemDetail"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Button from "@/components/atoms/Button";
import ItemStoreListSku from "@/components/molecules/ItemStoreListSku";
import itemStoreItemMixin from "@/components/molecules/mixins/itemStoreItemMixin";

export default {
  name: "ItemStoreItemPc",
  components: {
    Button,
    ItemStoreListSku,
  },
  mixins: [itemStoreItemMixin],
};
</script>

<style lang="scss" scoped>
.s-item {
  padding: 10px 18px;
  border-bottom: 1px solid #d6d6d6;

  &:first-child {
    border-top: 1px solid #d6d6d6;
  }

  &--title {
    position: relative;

    > h4 {
      font-size: 18px;
      font-weight: 700;
    }

    .accordion-button {
      position: absolute;
      top: 2px;
      right: 0;
    }
  }

  &--location {
    &.columns.is-mobile {
      margin-bottom: 0;
      margin-top: 0;
    }

    &--info {
      padding-right: 18px;
    }

    &--link {
      padding-left: 0;
      display: flex;
      justify-content: center;
      flex-direction: column;

      &::v-deep {
        .wrap {
          margin-right: 18px;
          .button {
            width: 100%;
          }
        }
      }
    }
  }

  &--acc {
    &--stock {
      flex-wrap: wrap;

      &__list {
        &.s-header {
          background-color: #f5f5f5;
          border-top: 1px solid #d6d6d6;
          border-bottom: 1px solid #d6d6d6;
        }
        &--label {
          text-align: center;
        }
      }
      &__sku {
        padding: 0;
        margin: 0;
        border-bottom: 0;
      }
    }
    &--buy {
      margin-top: 20px;
    }
  }
}
.fade-enter-active {
  transition: opacity 0.7s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
