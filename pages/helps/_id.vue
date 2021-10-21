<template>
  <div v-if="help" class="container">
    <Breadcrumb :items="breadcrumbs" />
    <SearchBox :placeholder="placeholder" />
    <ListTitle class="mb10">{{ help.title }}</ListTitle>
    <div class="mr10 ml10 mb50 is-size-7 ck-content" v-html="help.body"></div>
    <ListTitle class="mb20">このヘルプは役に立ちましたか？</ListTitle>
    <ButtonWrapper theme="flex" class-name="mb30">
      <Button theme="dark" @click="handleRate('good')">役にたった</Button>
      <Button theme="light" @click="handleRate('bad')">
        役にたたなかった
      </Button>
    </ButtonWrapper>
    <ListTitle class="mb10">他のヘルプ</ListTitle>
    <div class="mb50">
      <ul class="menu-list is-size-6">
        <li v-for="(obj, index) in others" :key="index" class="fs14">
          <nuxt-link :to="{ name: 'helps-id', params: { id: obj.id } }">
            {{ obj.title }}
          </nuxt-link>
        </li>
      </ul>
    </div>
    <BaseDialog
      ref="completeDialog"
      title="送信完了しました"
      ok-text="閉じる"
      :has-cancel="false"
      @ok="handleDialogClose"
    >
    </BaseDialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/organisms/Breadcrumb";
import SearchBox from "@/components/organisms/SearchBox";
import ListTitle from "@/components/organisms/ListTitle";
import BaseDialog from "@/components/atoms/BaseDialog";
import { extractFlatValidationError } from "@/plugins/vee-validate";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";
import * as httpStatusCode from "@/constants/httpStatusCode";
import { isNotFoundError } from "@/plugins/axios";

export default {
  components: {
    Breadcrumb,
    SearchBox,
    ListTitle,
    BaseDialog,
    ButtonWrapper,
    Button,
  },
  validate({ params }) {
    return /^\d+$/.test(params.id);
  },
  async asyncData({ store, route, error }) {
    const id = route.params.id;
    await Promise.all([
      store.dispatch("helps/get", { id }).catch((httpError) => {
        if (isNotFoundError(httpError)) {
          return error({ statusCode: httpStatusCode.NOT_FOUND });
        } else {
          return error({
            statusCode: httpStatusCode.INTERNAL_SERVER_ERROR,
          });
        }
      }),
    ]);
  },
  data() {
    return {
      placeholder: "お問い合わせを検索",
      error: null,
    };
  },
  computed: {
    helpsId() {
      return Number(this.$route.params.id);
    },
    ...mapGetters({
      help: "helps/detail",
      others: "helps/related",
    }),
    breadcrumbs() {
      const items = [
        {
          id: 1,
          name: "HOME",
          url: "/",
        },
        {
          id: 2,
          name: "ヘルプ",
          url: "/helps",
        },
      ];

      if (!this.help) {
        items.push({
          id: items.length + 1,
          name: "ヘルプ詳細",
        });
        return "";
      }

      if (this.help.help_categories && this.help.help_categories.length > 0) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        const data = this.help.help_categories.sort(
          (i1, i2) => i1.level - i2.level
        );
        data.forEach((item) => {
          items.push({
            id: items.length + 1,
            name: item.name,
            url: "/helps",
          });
        });
      }

      items.push({
        id: items.length + 1,
        name: this.help.title,
      });
      return items;
    },
  },
  methods: {
    async handleRate(val) {
      try {
        const params = {
          rate: val,
        };
        await this.$api.store(`contents/helps/${this.helpsId}`, params);
        this.$refs.completeDialog.show();
      } catch (error) {
        const errorMessages = extractFlatValidationError(error);
        // FIXME: どこからも参照されていない？
        this.$store.dispatch("error/setError", {
          title: "もう一度お試しください",
          detail: errorMessages[0],
        });
      }
    },
    handleDialogClose() {
      this.$refs.completeDialog.hide();
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  max-width: $desktop;
}
.menu-list li {
  a {
    padding: 15px 5px;
    margin: 0 5px 0 5px;
    position: relative;
    border-bottom: solid 1px #dbdbdb;
  }
}
</style>
