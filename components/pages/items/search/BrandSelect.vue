<template>
  <div class="wrapper">
    <div class="b-section">
      <h4 class="b-section-title">オリジナルブランド</h4>
      <template v-for="category in categories">
        <template v-if="groups.origin[category.value]">
          <div :key="category.key" class="b-block">
            <div v-if="category.key !== 'Nothing'" class="b-block-title">
              {{ categoryLabels[category.value] }}
            </div>
            <div class="columns is-mobile">
              <div
                v-for="option in groups.origin[category.value]"
                :key="option.id"
                class="column is-half-mobile is-one-third-tablet"
              >
                <Checkbox
                  :id="`brand-${option.id}`"
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
      <div v-for="initial in initials" :key="initial" class="b-block">
        <div class="b-block-title">
          {{ initial }}
        </div>
        <div class="columns is-mobile">
          <div
            v-for="option in groups.other[initial]"
            :key="option.id"
            class="column is-half-mobile is-one-third-tablet"
          >
            <Checkbox
              :id="`brand-${option.id}`"
              v-model="inputs[option.id]"
              :text="option.name"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Checkbox from "@/components/atoms/Checkbox";

export default {
  name: "SalesTypeSelect",
  components: {
    Checkbox,
  },
  props: {
    inputs: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
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
};
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 24px 2% 69px;

  .b-section {
    padding: 0 !important;
    margin-bottom: 20px;

    .b-section-title {
      font-size: 14px;
      border-bottom: 1px solid #000;
    }

    .b-block {
      margin-top: 12px;

      .b-block-title {
        font-weight: 700;
      }

      .columns {
        flex-wrap: wrap;

        .column {
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
