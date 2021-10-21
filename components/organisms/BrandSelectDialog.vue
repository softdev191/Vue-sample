<template>
  <BaseDialog ref="dialog" title="ブランド" @close="handleClose">
    <template #default>
      <div class="wrapper">
        <div class="b-section">
          <h4 class="b-section-title">オリジナルブランド</h4>
          <template v-for="category in categories">
            <template v-if="groups.origin[category.value]">
              <div :key="category.key" class="b-block">
                <div v-if="category.key !== 'Nothing'" class="b-block-title">
                  {{ categoryLabels[category.value] }}
                </div>
                <div class="columns">
                  <div
                    v-for="option in groups.origin[category.value]"
                    :key="option.id"
                    class="column is-one-quarter"
                  >
                    <Checkbox
                      :id="`pc-brand-${option.id}`"
                      v-model="inputs[option.id]"
                      :text="option.name"
                    />
                  </div>
                </div>
              </div>
            </template>
          </template>
        </div>
        <div class="b-section">
          <h4 class="b-section-title">その他のブランド</h4>
          <div v-for="initial in initials" :key="initial" class="b-block other">
            <div class="b-block-title">
              {{ initial }}
            </div>
            <div class="columns">
              <div
                v-for="option in groups.other[initial]"
                :key="option.id"
                class="column is-one-quarter"
              >
                <Checkbox
                  :id="`pc-brand-${option.id}`"
                  v-model="inputs[option.id]"
                  :text="option.name"
                />
              </div>
            </div>
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
  name: "BrandSelectDialog",
  components: {
    Checkbox,
    BaseDialog,
    NarrowDownButton,
  },
  data() {
    return {
      inputs: {},
    };
  },
  computed: {
    ...mapGetters({
      categoryGroupTokens: "master/categoryGroupTokens",
      categoryOptionGroup: "master/categoryOptionGroup",
    }),
    groups() {
      return this.$store.getters["master/brandGroups"];
    },
    categories() {
      return this.$store.getters["master/enums"].brand__category;
    },
    categoryLabels() {
      return this.categories.reduce((labels, category) => {
        return Object.assign(labels, { [category.value]: category.label });
      }, {});
    },
    initials() {
      const { other } = this.$store.getters["master/brandGroups"];
      return Object.keys(other).sort();
    },
  },
  methods: {
    handleEnter() {
      this.$emit("enter", { ...this.inputs });
      this.$refs.dialog.hide();
    },
    handleReset() {
      Object.keys(this.inputs).forEach((id) => {
        this.$set(this.inputs, id, false);
      });
    },
    handleClose() {
      this.close();
      this.$emit("close");
    },
    open({ inputs = {} } = {}) {
      this.inputs = { ...inputs };
      this.$refs.dialog.show();
    },
    close() {
      this.$refs.dialog.hide();
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

.wrapper {
  padding: 24px 2% 0;

  .b-section {
    padding: 0 !important;
    margin-bottom: 20px;

    .b-section-title {
      font-size: 16px;
      border-bottom: 2px solid #000;
    }

    .b-block {
      margin-top: 12px;
      padding-bottom: 20px;

      &.other {
        border-bottom: 1px solid #e6e6e6;
      }

      .b-block-title {
        font-weight: 700;
      }

      .columns {
        flex-wrap: wrap;

        .column {
          padding-bottom: 0;
          padding-top: 2px;

          &::v-deep .checkbox .label {
            border-bottom: 0;
            padding-bottom: 0;
            font-weight: normal;
          }
        }
      }
    }
  }
}
</style>
