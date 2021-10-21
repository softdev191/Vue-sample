<template>
  <div class="columns">
    <div class="staff-img">
      <img :src="staff.image" class="mt10 ml10" />
    </div>
    <div class="column staff-info mt5">
      <div>{{ staff.store }}</div>
      <div>{{ staff.address }}</div>
      <span>{{ staff.name }}</span>
      <span>{{ staff.height }}cm</span>
      <a :href="staff.instargramUrl" target="_blank">
        <div class="columns mt5">
          <div class="instagram-icon">
            <img src="@/assets/images/staff-instagram-icon.png" />
          </div>
          <span class="column fs10">
            {{ staff.instagramAccount }}
          </span>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      staff: {
        image: require("@/assets/images/staff-img.png"),
        store: "SCOTCLUB",
        address: "イオンモール札幌平岡 MAITRESSE, SCOTCLUB",
        name: "shimoda",
        height: "163",
        instagramAccount: "staff.scotclub",
        instargramUrl: "https://www.instagram.com/",
      },
    };
  },
  computed: {},
};
</script>
<style lang="scss" scoped>
.columns {
  display: flex;
  .staff-img img {
    display: block;
    border-radius: 50%;
    width: 60px;
    height: 60px;
  }
  .staff-info .column {
    display: inline-block;
  }
  .instagram-icon {
    padding: 9px;
  }
}
</style>
