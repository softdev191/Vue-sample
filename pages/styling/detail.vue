<template>
  <div>
    <div class="container">
      <Breadcrumb :items="breadcrumbs" class="mb-5" />
      <div class="tile">
        <article class="tile is-child sidemenu">
          <SideMenu />
        </article>
        <article class="tile is-child contents">
          <Carousel class="mb-5" />
          <StaffInfo class="mb30" />
          <div class="fs10 mb-1 mx-3">2020.02.27</div>
          <div class="fs10 mb-1 mx-3 mb-5">
            街に出かけるシーンで、カジュアルだけど、ちょっと可愛いさを演出できるようにコーデを考えました。
          </div>

          <div class="columns ml10 is-mobile is-gapless">
            <div class="return fs10">着こなし</div>
            <div class="return fs10 ml-2">着回しコーデ</div>
            <div class="return fs10 ml-2">遠出デートに最適</div>
          </div>

          <h2 class="ml10 fs14 mb-1">着用アイテム</h2>
          <div class="divider mb-5" />
          <Goods />

          <h2 class="ml10 fs14 mb-1">このスタッフの他のコーディネート</h2>
          <div class="divider mb-5" />
          <div class="columns ml10 staff is-mobile is-gapless">
            <img class="column" src="@/assets/images/stylings1.png" />
            <img class="column" src="@/assets/images/stylings1.png" />
            <img class="column" src="@/assets/images/stylings1.png" />
            <img class="column" src="@/assets/images/stylings1.png" />
            <img class="column" src="@/assets/images/stylings1.png" />
            <img class="column" src="@/assets/images/stylings1.png" />
            <img class="column" src="@/assets/images/stylings1.png" />
            <img class="column" src="@/assets/images/stylings1.png" />
          </div>

          <h2 class="ml10 fs14 mb-1">このブランドの他のコーディネート</h2>
          <div class="divider mb-5" />
          <Stylings :sp-display="3" />

          <Address class="mb100" />
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import Carousel from "@/components/organisms/CarouselOfStyling.vue";
import Goods from "@/components/organisms/Goods";
import StaffInfo from "@/components/organisms/StaffInfo";
import Stylings from "@/components/organisms/Stylings";
import Breadcrumb from "@/components/organisms/Breadcrumb";
import Address from "@/components/organisms/Address";

export default {
  components: {
    Carousel,
    Goods,
    StaffInfo,
    Stylings,
    Breadcrumb,
    Address,
  },
  data() {
    return {
      breadcrumbs: [
        {
          id: 1,
          name: "HOME",
          url: "/",
        },
        {
          id: 2,
          name: "スタイリング",
          url: "/styling",
        },
        {
          id: 3,
          name: "スタイリング詳細",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.columns {
  padding-left: 10px;
  .return {
    padding: 3px 17px;
    height: 24px;
    border: 1px solid #707070;
  }
}
.staff {
  display: flex;
  width: auto;
  overflow-x: auto;
  margin: 0;
  .column {
    width: 33%;
    margin: 5px 2.5px !important;
  }
}
.container {
  max-width: $desktop;
}
.sidemenu {
  @include touch {
    display: none;
  }
  @include desktop {
    flex: none;
    width: 25%;
    padding-right: 3%;
  }
}
.contents {
  @include touch {
    width: 100%;
  }
  @include desktop {
    flex: none;
    width: 75%;
  }
}
</style>
