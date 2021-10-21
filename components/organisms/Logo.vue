<template>
  <div>
    <UrgentNotice />
    <div class="wrap">
      <div class="columns is-mobile is-gapless mb-2">
        <div class="column is-12">
          <nuxt-link to="/">
            <img src="@/assets/images/logo.png" />
          </nuxt-link>
        </div>
      </div>
      <div class="divider"></div>
    </div>
  </div>
</template>

<script>
import UrgentNotice from "@/components/partials/UrgentNotice";

export default {
  name: "Logo",
  components: {
    UrgentNotice,
  },
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.wrap {
  padding: 12px 0 0 0;

  .divider {
    background-color: #a7a7a7;
    border-top: solid 1px #a7a7a7;
    margin: 0;
  }

  .column {
    text-align: center;
    flex: none;
    width: 20%;

    a {
      display: block;
      width: 100%;
      font-size: 8px;
      color: #000;
      img {
        margin-bottom: 5px;
      }
    }
  }
}
</style>
