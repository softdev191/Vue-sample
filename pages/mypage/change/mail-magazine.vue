<template>
  <div class="fixed-container">
    <ErrorBox v-if="error">{{ error }}</ErrorBox>
    <Breadcrumb text="HOME > マイページ > メルマガとDMの登録・停止手続き" />
    <div class="mypage-layout">
      <SideMenu />
      <div class="mypage-main">
        <PageTitle>メルマガとDMの登録・停止手続き</PageTitle>
        <section class="form-section">
          <div class="form-section-title">メールマガジン登録</div>
          <div class="form-section-content">
            <p class="text mb20">
              商品⼊荷情報や、お得なイベント情報、クーポン等を受け取ることができます。
            </p>
            <div class="form-group">
              <div class="form-radio-group">
                <div
                  v-for="mailDmType in mailDmTypes"
                  :key="mailDmType.key"
                  class="form-radio-wrapper"
                >
                  <input
                    :id="`MailDm_${mailDmType.key}`"
                    v-model="mailMagazine"
                    class="form-checkbox"
                    type="radio"
                    name="mail_magazine"
                    :value="mailDmType.value"
                  />
                  <label class="form-label" :for="`MailDm_${mailDmType.key}`">
                    {{ mailDmType.label }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section class="form-section">
          <div class="form-section-title">郵便DM登録</div>
          <div class="form-section-content">
            <p class="text mb20">
              商品⼊荷情報や、お得なイベント情報、クーポン等を受け取ることができます。
            </p>
            <div class="form-group">
              <div class="form-radio-group flex">
                <div
                  v-for="postDmType in postDmTypes"
                  :key="postDmType.key"
                  class="form-radio-wrapper mr100"
                >
                  <input
                    :id="`PostDm_${postDmType.key}`"
                    v-model="postalDm"
                    class="form-checkbox"
                    type="radio"
                    name="postal_dm"
                    :value="postDmType.value"
                  />
                  <label class="form-label" :for="`PostDm_${postDmType.key}`">
                    {{ postDmType.label }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </section>
        <ButtonWrapper theme="normal">
          <Button
            theme="dark"
            @click="update"
            :disabled="!valid"
            :pending="pending"
          >
            更新する
          </Button>
        </ButtonWrapper>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import ErrorBox from "@/components/atoms/ErrorBox";
import PageTitle from "@/components/atoms/PageTitle";
import Breadcrumb from "@/components/partials/Breadcrumb";
import SideMenu from "@/components/pages/mypage/SideMenu";
import { extractFlatValidationError } from "@/plugins/vee-validate";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";

export default {
  components: {
    ErrorBox,
    PageTitle,
    Breadcrumb,
    SideMenu,
    ButtonWrapper,
    Button,
  },
  async fetch() {
    this.loadData();
    await this.$store.dispatch("master/fetch");
  },
  data() {
    return {
      mailMagazine: undefined,
      postalDm: undefined,
      error: null,
    };
  },
  computed: {
    ...mapState({
      user(state, getters) {
        return state.auth.user;
      },
    }),
    ...mapGetters({
      mailDmTypes: "master/mailDmTypes",
      postDmTypes: "master/postDmTypes",
      pending: "common/pending",
    }),
  },
  methods: {
    loadData() {
      this.mailMagazine = this.user.mail_dm;
      this.postalDm = this.user.post_dm;
    },
    async update() {
      try {
        this.$store.commit("common/pending", true);
        await this.$api.update(`member/${this.user.id}/mail`, {
          mail_dm: this.mailMagazine,
          post_dm: this.postalDm,
        });

        await this.$auth.fetchUser();

        this.$router.push({
          path: "/mypage",
          query: { result: "MailMagazineUpdated" },
        });
      } catch (error) {
        const messages = extractFlatValidationError(error);
        this.error = messages[0];
      } finally {
        this.$store.commit("common/pending", false);
      }
    },
  },
  head() {
    return {
      title: "メルマガとDMの登録・停止手続き",
    };
  },
};
</script>

<style lang="scss" scoped>
.text {
  font-size: 12px;
}
.mb20 {
  margin-bottom: 20px;
}
.form-section-title {
  font-size: 14px;
  margin-bottom: 12px;
}
.form-radio-group {
  > .form-radio-wrapper {
    margin-bottom: 28px;
  }
  &.flex {
    display: flex;
    > .form-radio-wrapper {
      margin-right: 50px;
      margin-bottom: 0;
      &.mr {
        margin-right: 100px;
      }
    }
  }
}
</style>
