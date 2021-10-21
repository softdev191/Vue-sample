<template>
  <div class="background view-more" :style="setBackgroundColor">
    <div
      class="columns is-mobile is-centered"
      :class="{ 'is-gapless': gap == 'less' }"
    >
      <div class="column has-text-centered">
        <ButtonWrapper>
          <Button :theme="theme" @click="gotoMove(link)"> VIEW MORE</Button>
        </ButtonWrapper>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";

export default {
  components: {
    Button,
    ButtonWrapper,
  },
  props: {
    theme: {
      type: String,
      default: "light",
    },
    link: {
      type: Object,
      default: () => {
        return {
          path: "/",
        };
      },
    },
    background: {
      type: String,
      default: "",
    },
    gap: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      notify: {},
    };
  },
  computed: {
    setBackgroundColor() {
      return {
        "--background-color": this.background,
      };
    },
  },
  methods: {
    gotoMove(link) {
      this.$router.push(link);
    },
  },
};
</script>

<style lang="scss" scoped>
.background.view-more {
  background-color: var(--background-color);
  .top-divider {
    border-top: solid 1px #000;
    width: 40px;
    margin: 0 auto;
  }
  .columns {
    padding-bottom: 100px;
    margin-bottom: 0;
    &.is-gapless {
      padding-bottom: 50px;
    }
  }
  .column {
    @include desktop {
      max-width: 300px;
    }
  }
}
</style>
