<template>
  <BaseDialog
    ref="baseModal"
    :has-footer="false"
    :class="showRequestButton ? 'request-form' : 'complete'"
    @close="handleClose"
  >
    <template #header>
      <div class="my-modal-title has-text-centered">再入荷リクエスト停止</div>
    </template>
    <template v-if="showRequestButton">
      <div>
        <p class="has-text-centered">
          再入荷リクエストを停止します。よろしいですか？
        </p>
        <div class="columns">
          <div class="column ok-button">
            <Button @click="handleClickOk">OK</Button>
          </div>
          <div v-if="errorMessage" class="error">
            {{ errorMessage }}
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <p class="has-text-centered">再入荷リクエストを停止しました。</p>
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from "@/components/atoms/BaseDialog";
import Button from "@/components/atoms/Button";

export default {
  name: "RedisplayRequestCancelDialog",
  components: {
    BaseDialog,
    Button,
  },
  data() {
    return {
      isShow: false,
      itemDetail: {},
      showRequestButton: true,
      errorMessage: "",
      pending: false,
    };
  },
  methods: {
    handleClose() {
      this.close();
    },
    async handleClickOk() {
      if (this.pending) {
        return;
      }

      this.pending = true;

      try {
        this.errorMessage = "";

        await this.$store.dispatch("redisplayRequest/delete", {
          itemDetailId: this.itemDetail.id,
        });

        this.showComplete();
      } catch (error) {
        console.error(error);
        this.errorMessage = "リクエストに失敗しました。";
      } finally {
        this.pending = false;
      }
    },
    open({ itemDetail }) {
      this.itemDetail = itemDetail;

      this.$nextTick(() => {
        this.$refs.baseModal.show();
        this.isShow = true;
      });
    },
    close() {
      this.itemDetail = {};
      this.isShow = false;
      this.showRequestButton = true;

      if (this.$refs.baseModal.isShow) {
        this.$refs.baseModal.hide();
      }
    },
    showComplete() {
      this.showRequestButton = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.my-modal-wrapper.is-open.request-form {
  top: 10%;
}
::v-deep {
  .fixed-container {
    max-height: 400px !important;
    max-width: 400px;
  }
}

.error {
  text-align: center;
  width: 100%;
  color: $error;
  margin-top: -11px;
  margin-bottom: 3px;
}
.ok-button {
  margin: 14px auto 0;
}
</style>
