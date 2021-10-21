<script>
import { VueAgile } from "vue-agile";

/**
 * swipeをオプショナルにする
 */
export default {
  name: "CustomAgile",
  extends: VueAgile,
  mounted() {
    window.addEventListener("resize", this.getWidth);

    if (this.options.swipe) {
      this.$refs.track.addEventListener("touchstart", this.handleMouseDown);
      this.$refs.track.addEventListener("touchend", this.handleMouseUp);
      this.$refs.track.addEventListener("touchmove", this.handleMouseMove);
      this.$refs.track.addEventListener("mousedown", this.handleMouseDown);
      this.$refs.track.addEventListener("mouseup", this.handleMouseUp);
      this.$refs.track.addEventListener("mousemove", this.handleMouseMove);
    }

    this.isSSR = false;
    this.reload();
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.getWidth);

    if (this.options.swipe) {
      this.$refs.track.removeEventListener("touchstart", this.handleMouseDown);
      this.$refs.track.removeEventListener("touchend", this.handleMouseUp);
      this.$refs.track.removeEventListener("touchmove", this.handleMouseMove);
      this.$refs.track.removeEventListener("mousedown", this.handleMouseDown);
      this.$refs.track.removeEventListener("mouseup", this.handleMouseUp);
      this.$refs.track.removeEventListener("mousemove", this.handleMouseMove);
    }

    this.disableAutoPlay();
  },
  methods: {
    handleMouseDown(e) {
      if (!this.options.swipe) {
        return;
      }
      this.isMouseDown = true;

      if (e.type.includes("touch")) {
        this.dragStartX = e.touches[0].clientX;
        this.dragStartY = e.touches[0].clientY;
      }
      if (e.type.includes("mouse")) {
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;
      }
    },

    handleMouseMove(e) {
      if (!this.options.swipe) {
        return;
      }
      let positionX;
      let positionY;
      if (e.type.includes("touch")) {
        positionX = e.touches[0].clientX;
        positionY = e.touches[0].clientY;
      }
      if (e.type.includes("mouse")) {
        positionX = e.clientX;
        positionY = e.clientY;
      }
      const dragDistanceX = Math.abs(positionX - this.dragStartX);
      const dragDistanceY = Math.abs(positionY - this.dragStartY);
      if (dragDistanceX > 3 * dragDistanceY) {
        this.disableScroll();
        this.dragDistance = positionX - this.dragStartX;
      }
    },

    handleMouseUp() {
      if (!this.options.swipe) {
        return;
      }
      this.isMouseDown = false;
      this.enableScroll();
    },

    handleMouseOver(element) {
      if (!this.options.swipe) {
        return;
      }
      if (this.settings.autoplay) {
        if (
          (element === "dot" && this.settings.pauseOnDotsHover) ||
          (element === "track" && this.settings.pauseOnHover)
        ) {
          this.isAutoplayPaused = true;
        }
      }
    },

    handleMouseOut(element) {
      if (!this.options.swipe) {
        return;
      }
      if (this.settings.autoplay) {
        if (
          (element === "dot" && this.settings.pauseOnDotsHover) ||
          (element === "track" && this.settings.pauseOnHover)
        ) {
          this.isAutoplayPaused = false;
        }
      }
    },
  },
};
</script>
