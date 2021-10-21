<template>
  <div :class="{ horizonal: horizonal }">
    <div class="columns is-mobile is-multiline is-gapless style-list">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="column mb-6 style-item"
        :class="[pcClass, spClass]"
      >
        <nuxt-link :to="{ name: 'styling-detail' }">
          <figure class="image is-fullwidth mb-3">
            <img :src="item.image_url" />
          </figure>
          <div class="brand mb-1 mx-3">{{ item.shop_name }}</div>
          <div class="height mb-1 mx-3">{{ item.user_height }}cm</div>
        </nuxt-link>
      </div>
      <InfiniteLoading
        v-if="isAutoloading"
        :direction="horizonal ? 'right' : 'bottom'"
        @reached-end="($state) => $emit('reached-end', $state)"
      />
    </div>
  </div>
</template>

<script>
import InfiniteLoading from "@/components/molecules/InfiniteLoading";

export default {
  name: "Stylings",
  emits: ["reached-end"],
  components: {
    InfiniteLoading,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    desktopSize: {
      type: Number,
      default: 4,
    },
    spDisplay: {
      type: Number,
      default: 2,
    },
    horizonal: {
      type: Boolean,
      default: false,
    },
    isAutoloading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    spClass() {
      return this.spDisplay === 2 ? "sp-two" : "sp-three";
    },
    pcClass() {
      return this.desktopSize === 4 ? "four" : "five";
    },
  },
};
</script>

<style lang="scss" scoped>
.columns {
  justify-content: space-between;
}
.column {
  padding: 0;
  @include touch {
    &.sp-two {
      flex: none;
      width: calc(50% - 3px);
    }
    &.sp-three {
      flex: none;
      width: calc(33% - 3px);
    }
  }

  @include desktop {
    &.four {
      flex: none;
      width: calc(25% - 3px);
    }
    &.five {
      flex: none;
      width: calc(20% - 3px);
    }
  }
}
.horizonal {
  .style-list {
    overflow-x: auto;
    flex-wrap: nowrap;

    .style-item {
      margin-right: 6px;
    }
  }
}
</style>
