<template>
  <BaseDialog
    ref="baseModal"
    :has-footer="false"
    :class="showRequestForm ? 'request-form' : 'complete'"
    @close="handleClose"
  >
    <template #header>
      <div class="my-modal-title">再入荷リクエスト</div>
      <a class="header-icon sp-only" @click.prevent="handleClose">
        <fa :icon="faChevronLeft" />
      </a>
    </template>
    <template v-if="showRequestForm">
      <RedisplayRequestForm
        v-if="isShow"
        :item="item"
        :item-detail="itemDetail"
        class="c-wrapper"
        @saved="handleSaved"
      />
    </template>
    <template v-else>
      <h4 class="complete-title">
        リクエスト完了しました。<br />
        ありがとうございました。
      </h4>
      <p class="complete-body">
        ご入力いただいた　{{
          sentEmail
        }}　宛てに、リクエスト完了メールを送信しました。お手数ですが一度ご確認ください。<br />
        　もしメールが届かない場合は、再入荷お知らせメールも届かない可能性がございますので、他のメールアドレスでリクエストしていただければと存じます。<br />
        <br />
        ・再入荷が出来た時には、自動でお知らせメールを配信します。<br />
        　※再入荷が出来なかった場合のメール配信はされません。申し訳ございませんが、予めご了承ください。<br />
        <br />
        ・在庫確保をお約束するサービスではございません。再入荷後に直ぐに売り切れてしまう事がございます。<br />
        <br />
        ・セール,アウトレット商品は、直接お問い合わせいただいても再入荷予定のお答えは出来ません。メールの配信をお待ちください。
      </p>
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from "@/components/atoms/BaseDialog";
import RedisplayRequestForm from "@/components/organisms/RedisplayRequestForm";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

export default {
  name: "RedisplayRequestDialog",
  components: {
    BaseDialog,
    RedisplayRequestForm,
  },
  data() {
    return {
      faChevronLeft,
      isShow: false,
      item: {},
      itemDetail: {},
      showRequestForm: true,
    };
  },
  computed: {
    redisplayRequestDict() {
      return this.$store.getters["redisplayRequest/dict"];
    },
    sentEmail() {
      if (!this.redisplayRequestDict[this.itemDetail.id]) {
        return "";
      }
      return this.redisplayRequestDict[this.itemDetail.id].email;
    },
  },
  methods: {
    handleClose() {
      this.close();
    },
    handleSaved() {
      this.showComplete();
    },
    open({ item, itemDetail }) {
      this.item = item;
      this.itemDetail = itemDetail;

      this.$nextTick(() => {
        this.$refs.baseModal.show();
        this.isShow = true;
      });
    },
    close() {
      this.item = {};
      this.itemDetail = {};
      this.isShow = false;
      this.showRequestForm = true;

      if (this.$refs.baseModal.isShow) {
        this.$refs.baseModal.hide();
      }
    },
    showComplete() {
      this.showRequestForm = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.my-modal-wrapper {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  z-index: 10000;

  .header-icon {
    display: block;
    position: absolute;
    top: 14px;
    left: 11px;
    @include desktop {
      display: none;
    }
  }

  &.request-form {
    &::v-deep {
      .my-modal-content {
        .my-modal-header {
          .my-modal-close {
            display: block;
            @include touch {
              display: none;
            }
          }
        }
      }
    }
  }
  &.complete {
    .header-icon {
      display: none;
    }

    &::v-deep {
      .my-modal-content {
        .my-modal-header {
          .my-modal-close {
            display: block;
          }
        }
      }
    }
  }

  &::v-deep {
    .fixed-container {
      padding: 0;
      margin: 0;
      width: 100%;
      height: 100%;

      @include desktop {
        max-width: 680px;
      }

      .my-modal-content {
        height: 100%;
        max-height: 100%;
        padding: 0 0 20px 0;

        .my-modal-header {
          height: 54px;
          border-bottom: 1px solid #dbdbdb;
          position: relative;

          @include desktop {
            border-bottom: 0;
            height: 66px;
          }

          .my-modal-title {
            height: 100%;
            padding-top: 19px;
            text-align: center;
            font-weight: normal;

            @include desktop {
              padding-top: 36px;
            }
          }
        }

        .my-modal-body {
          padding: 0 0 30px 0;
        }

        @include desktop {
          height: 92%;
          top: 4%;
          .my-modal-body {
            padding: 15px 0 30px 0;
            height: 100%;
            max-height: 400px;
            .c-wrapper {
              height: 100%;
            }
          }
        }
      }
    }
  }
}
.complete-title {
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  padding: 18px 0;
}
.complete-body {
  padding: 0 2%;
}
</style>
