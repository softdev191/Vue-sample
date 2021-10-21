<template>
  <div></div>
</template>

<script>
import querystring from "querystring";

export default {
  async beforeMount() {
    try {
      const { token } = querystring.parse(
        window.location.search.replace(/^\?/, "")
      );

      await this.$auth.setUserToken(token);

      if (this.$auth.loggedIn) {
        this.$router.push("/mypage");
      } else {
        this.$router.push("/404");
      }
    } catch (error) {
      console.error(error);
      this.$router.push("/404");
    }
  },
};
</script>
