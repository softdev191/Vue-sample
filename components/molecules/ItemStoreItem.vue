<template>
  <div class="s-item">
    <div class="s-item--title">
      <h4>{{ store.name }}</h4>
      <AccordionButton
        class="accordion-button"
        :is-open="isAccordionOpen"
        @click="handleClickAccordionButton"
      />
    </div>
    <div class="s-item--location columns is-mobile">
      <div class="column is-9 s-item--location--info">
        <span>{{ `${store.address1} ${store.address2}` }}</span
        ><br />
        <span>{{ store.phone_number_1 }}</span
        ><br />
        <span>{{ store.phone_number_2 }}</span>
      </div>
      <div class="column is-3 s-item--location--link">
        <Button :href="googleMapUrl" theme="light" tag="a" target="_blank"
          >MAP</Button
        >
      </div>
    </div>
    <transition name="fade">
      <div v-show="isAccordionOpen" class="s-item--acc">
        <ItemStockNote />
        <ItemStockSummary :item="item" />
        <div class="s-item--acc--stock">
          <div class="s-item--acc--stock__list s-header columns is-mobile">
            <div class="is-10 column"></div>
            <div class="is-2 column s-item--acc--stock__list--label">店舗</div>
          </div>
          <ItemStoreListSku
            v-for="(itemDetail, index) in item.item_details"
            :key="index"
            :item-detail-store="itemDetailStoreDict[itemDetail.id] || {}"
            :item-detail="itemDetail"
          />
        </div>
        <div class="s-item--acc--buy">
          <Button theme="light" @click="$emit('buy')"
            >オンラインで購入する</Button
          >
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Button from "@/components/atoms/Button";
import AccordionButton from "@/components/atoms/AccordionButton";
import ItemStoreListSku from "@/components/molecules/ItemStoreListSku";
import ItemStockNote from "@/components/molecules/ItemStockNote";
import ItemStockSummary from "@/components/molecules/ItemStockSummary";
import itemStoreItemMixin from "@/components/molecules/mixins/itemStoreItemMixin";

export default {
  name: "ItemStoreList",
  emmits: ["buy"],
  components: {
    Button,
    AccordionButton,
    ItemStoreListSku,
    ItemStockNote,
    ItemStockSummary,
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
