<script>
import InfiniteLoading from "vue-infinite-loading";

/**
 * 水平方向のスクロールに対応
 */
export default {
  name: "InfiniteLoadingExtra",
  extends: InfiniteLoading,
  methods: {
    getCurrentDistance() {
      let distance = 0;

      if (this.direction === "top") {
        distance =
          typeof this.scrollParent.scrollTop === "number"
            ? this.scrollParent.scrollTop
            : this.scrollParent.pageYOffset;
      } else if (this.direction === "left") {
        distance =
          typeof this.scrollParent.scrollLeft === "number"
            ? this.scrollParent.pageXOffset
            : this.scrollParent.scrollLeft;
      } else if (this.direction === "bottom") {
        const infiniteElmOffsetTopFromBottom = this.$el.getBoundingClientRect()
          .top;
        const scrollElmOffsetTopFromBottom =
          this.scrollParent === window
            ? window.innerHeight
            : this.scrollParent.getBoundingClientRect().bottom;
        distance =
          infiniteElmOffsetTopFromBottom - scrollElmOffsetTopFromBottom;
      } else if (this.direction === "right") {
        const infiniteElmOffsetLeftFromRight = this.$el.getBoundingClientRect()
          .left;
        const scrollElmOffsetLeftFromRight =
          this.scrollParent === window
            ? window.innerWidth
            : this.scrollParent.getBoundingClientRect().right;
        distance =
          infiniteElmOffsetLeftFromRight - scrollElmOffsetLeftFromRight;
      }

      return distance;
    },

    getScrollParent(elm = this.$el) {
      if (elm.tagName === "BODY") {
        return window;
      }

      if (!this.forceUseInfiniteWrapper) {
        if (
          (this.direction === "top" || this.direction === "bottom") &&
          ["scroll", "auto"].includes(getComputedStyle(elm).overflowY)
        ) {
          return elm;
        }

        if (
          (this.direction === "left" || this.direction === "right") &&
          ["scroll", "auto"].includes(getComputedStyle(elm).overflowX)
        ) {
          return elm;
        }
      }

      if (
        elm.hasAttribute("infinite-wrapper") ||
        elm.hasAttribute("data-infinite-wrapper")
      ) {
        return elm;
      }

      return this.getScrollParent(elm.parentNode);
    },
  },
};
</script>
