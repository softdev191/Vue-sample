<template>
  <div class="wrap">
    <UrgentNotice />
    <Header />
    <div class="main">
      <transition name="page">
        <Nuxt />
      </transition>
    </div>
    <Footer />
    <FooterMenu
      class="sp-only"
    />　<!-- FooterMenu内で要素の高さ分底上げしているので、一番最後におくようにしてください。 -->
    <GlobalLoading />
  </div>
</template>

<script>
import UrgentNotice from "@/components/partials/UrgentNotice";
import Header from "@/components/partials/Header";
import Footer from "@/components/partials/Footer";
import FooterMenu from "@/components/organisms/FooterMenu";
import GlobalLoading from "@/components/organisms/loading/GlobalLoading";

export default {
  components: {
    UrgentNotice,
    Header,
    Footer,
    FooterMenu,
    GlobalLoading,
  },
  data() {
    return {
      setPaddingTop: {},
    };
  },
};
</script>

<style lang="scss">
html {
  -webkit-overflow-scrolling: touch;
  font-size: 75% !important;
}
body {
  overflow-x: hidden;
  overflow-y: visible;
  background-color: #fff;
}
.main {
  min-height: calc(100vh - 125.5px);
  @include touch {
    padding: 0 0 50px;
    min-height: calc(100vh - 50px);
  }
}
</style>
