<template>
  <BaseDialog ref="dialog" title="カテゴリ" @close="handleClose">
    <template #default>
      <div
        v-for="(token, index1) in categoryGroupTokens"
        :key="index1"
        class="group"
        :class="{ border: index1 < categoryGroupTokens.length - 1 }"
      >
        <div class="all">
          <Checkbox
            :id="`pc-category-${categoryOptionGroup[token].id}`"
            v-model="inputGroup[token]"
            :text="categoryOptionGroup[token].name"
            @input="
              (value) => handleChangeAll(value, categoryOptionGroup[token])
            "
          />
        </div>
        <div class="columns is-mobile members">
          <div
            v-for="(category, index2) in categoryOptionGroup[token].options"
            :key="index2"
            class="column is-half-mobile is-one-quarter"
          >
            <Checkbox
              :id="`pc-category-${category.id}`"
              v-model="inputs[category.id]"
              :text="category.name"
            />
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="nb-wrapper">
        <NarrowDownButton @search="handleEnter" @reset="handleReset">
          <template #reset>条件を解除</template>
          <template #enter>選択する</template>
        </NarrowDownButton>
      </div>
    </template>
  </BaseDialog>
</template>

<script>
import { mapGetters } from "vuex";
import BaseDialog from "@/components/atoms/BaseDialog";
import NarrowDownButton from "@/components/organisms/NarrowDownButton";
import Checkbox from "@/components/atoms/Checkbox";

export default {
  name: "CategorySelectDialog",
  components: {
    Checkbox,
    BaseDialog,
    NarrowDownButton,
  },
  data() {
    return {
      inputGroup: {},
      inputs: {},
      isFirst: true,
    };
  },
  computed: {
    ...mapGetters({
      categoryGroupTokens: "master/categoryGroupTokens",
      categoryOptionGroup: "master/categoryOptionGroup",
    }),
  },
  methods: {
    handleChangeAll(value, group) {
      group.options.forEach(({ id }) => {
        this.$set(this.inputs, id, value);
      });
    },
    handleEnter() {
      this.$emit("enter", { ...this.inputs });
      this.$refs.dialog.hide();
    },
    handleReset() {
      this.resetInput();
    },
    handleClose() {
      this.close();
      this.$emit("close");
    },
    open({ inputs = {} } = {}) {
      this.inputs = { ...inputs };
      this.$refs.dialog.show();

      if (this.isFirst) {
        this.assignDefaultAllCheck();
        this.isFirst = false;
      }
    },
    close() {
      this.$refs.dialog.hide();
    },
    resetInput() {
      Object.keys(this.inputGroup).forEach((key) => {
        this.$set(this.inputGroup, key, false);
      });
      Object.keys(this.inputs).forEach((key) => {
        this.$set(this.inputs, key, false);
      });
    },
    assignDefaultAllCheck() {
      const inputs = this.inputs;
      const groups = this.categoryOptionGroup;

      Object.keys(groups).forEach((token) => {
        const group = groups[token];
        const ids = group.options.map(({ id }) => id);

        if (ids.length === 0) {
          return;
        }

        const selectedCount = ids.reduce(
          (sum, id) => sum + Number(Boolean(inputs[id])),
          0
        );

        if (selectedCount === ids.length) {
          this.$set(this.inputGroup, token, true);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.my-modal-wrapper::v-deep {
  .my-modal-content {
    padding: 54px 54px;
    .my-modal-header {
      font-weight: normal;
    }
  }
}

::v-deep .checkbox .label {
  border-bottom: 0;
  padding-bottom: 0;
}

.nb-wrapper {
  width: 44%;
  margin: 0 auto;
}

.group {
  padding: 12px 0 29px 0;

  &.border {
    border-bottom: solid 1px #e3e3e3;
  }

  .members {
    margin-top: 6px;

    .column {
      padding-bottom: 0;
      padding-top: 0;
      margin-top: 4px;

      &::v-deep .checkbox {
        .label {
          font-weight: normal;
        }
      }
    }
  }
}

.columns {
  flex-wrap: wrap;
}
</style>
