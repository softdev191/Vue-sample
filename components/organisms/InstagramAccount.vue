<template>
  <div class="is-mobile is-centered has-text-centered">
    <button class="button fs14" :onclick="instaAcount">
      <IGIconBlackSvg />
      <IGIconWhiteSvg class="hover" />
      <span>INSTAGRAM ACCOUNT</span>
    </button>
  </div>
</template>

<script>
import IGIconBlackSvg from "@/assets/images/icons/instagram-icon-black.svg";
import IGIconWhiteSvg from "@/assets/images/icons/instagram-icon-white.svg";
export default {
  components: {
    IGIconBlackSvg,
    IGIconWhiteSvg,
  },
  props: {
    account: {
      type: String,
      default: null,
    },
  },
  computed: {
    instaAcount() {
      return "window.open('https://www.instagram.com/" + this.account + "')";
    },
  },
};
</script>

<style lang="scss" scoped>
.button {
  flex: none;
  width: 355px;
  height: 50px;
  align-items: center;
  border: 1px solid $black;
  border-radius: 0;
  box-shadow: none;
  display: inline-flex;
  span {
    margin-left: 10px;
  }
  svg.hover {
    display: none;
  }
  &:hover {
    color: $white;
    background-color: $dim-gray;
    border: 1px solid $dim-gray;
    svg {
      display: none;
    }
    svg.hover {
      display: block;
    }
  }
}
</style>
