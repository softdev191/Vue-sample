<template>
  <div>
    <div class="container">
      <Breadcrumb :items="breadcrumbs" class="mb15" />
      <div class="tile">
        <article class="tile is-child sidemenu">
          <SideMenu />
        </article>
        <article class="tile is-child contents">
          <StaffInfo class="mb30" />
          <Staff />
          <Address class="mb100" />
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import Staff from "@/components/organisms/Staff";
import StaffInfo from "@/components/organisms/StaffInfo";
import Breadcrumb from "@/components/organisms/Breadcrumb";
import Address from "@/components/organisms/Address";

export default {
  components: {
    Staff,
    StaffInfo,
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
          url: "/styling/detail",
        },
        {
          id: 3,
          name: "スタッフ詳細",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.columns {
  padding-left: 10px;
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
.content {
  padding: 0 10px;
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
