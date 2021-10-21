<template>
  <div
    class="loading"
    :style="{
      fontSize: `${size}px`,
      marginTop: `${margin}px`,
      marginBottom: `${margin}px`,
    }"
  ></div>
</template>

<script>
export default {
  name: "Indicator",
  props: {
    size: {
      type: Number,
      default: 4,
    },
  },
  computed: {
    margin() {
      return Math.round(this.size * 8);
    },
  },
};
</script>

<style lang="scss" scoped>
/* stylelint-disable */
.loading,
.loading:before,
.loading:after {
  border-radius: 50%;
  width: 2.5em;
  height: 2.5em;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation: load7 1.8s infinite ease-in-out;
  animation: load7 1.8s infinite ease-in-out;
}
.loading {
  color: #2fb5f9;
  font-size: 10px;
  margin: 80px auto;
  position: relative;
  text-indent: -9999em;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}
.loading:before,
.loading:after {
  content: "";
  position: absolute;
  top: 0;
}
.loading:before {
  left: -3.5em;
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}
.loading:after {
  left: 3.5em;
}
@-webkit-keyframes load7 {
  0%,
  80%,
  100% {
    box-shadow: 0 2.5em 0 -1.3em;
  }
  40% {
    box-shadow: 0 2.5em 0 0;
  }
}
@keyframes load7 {
  0%,
  80%,
  100% {
    box-shadow: 0 2.5em 0 -1.3em;
  }
  40% {
    box-shadow: 0 2.5em 0 0;
  }
}
</style>
