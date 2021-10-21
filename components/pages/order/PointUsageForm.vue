<template>
  <ValidationObserver
    v-slot="{ validate }"
    ref="observer"
    tag="div"
    @update:flags="(value) => $emit('update:validation', value)"
  >
    <div class="current-point-row mb20">
      所持ポイント数
      <span class="current-point">{{ usablePoints }}pt</span>
    </div>
    <ValidationProvider tag="div" class="form-group" vid="use_point_type">
      <div
        v-for="(option, index) in usePointTypeOptions"
        :key="index"
        class="form-radio-wrapper"
        :class="{ mb10: index < usePointTypeOptions.length - 1 }"
      >
        <input
          :id="`point_usage_${option.id}`"
          v-model="inputUsePointType"
          class="form-checkbox"
          type="radio"
          name="use_point_type"
          :value="option.id"
          @input="validate"
        />
        <label class="form-label" :for="`point_usage_${option.id}`">
          {{ option.name }}
        </label>
      </div>
    </ValidationProvider>
    <div v-show="inputUsePointType === usePointTypeKv.Part" class="form-group">
      <ValidationProvider
        v-slot="{ dirty, invalid, errors }"
        vid="points"
        name="利用するポイント"
        :rules="`required_if:use_point_type,${usePointTypeKv.Part}|between:0,${usablePoints}`"
      >
        <input
          id="points"
          v-model="inputs.use_point"
          class="form-control w175 mr10"
          type="number"
          name="points"
        />
        <label class="form-label w175">ポイント利用する</label>
        <div v-if="dirty && invalid && errors[0]" class="error error-msg">
          {{ errors[0] }}
        </div>
      </ValidationProvider>
    </div>
  </ValidationObserver>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    title: {
      type: String,
      default: "5. ポイント利用",
    },
    inputs: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapGetters({
      usablePoints: "point/amount",
      usePointTypeKv: "order/usePointTypeKv",
      usePointTypeOptions: "order/usePointTypeOptions",
    }),
    inputUsePointType: {
      get() {
        return this.inputs.use_point_type || this.usePointTypeKv.None;
      },
      set(value) {
        this.$set(this.inputs, "use_point_type", value);
      },
    },
  },
  methods: {
    validateForm() {
      return this.$refs.observer.validate();
    },
  },
};
</script>

<style lang="scss" scoped>
.current-point-row {
  font-size: 10px;
  text-align: center;
  .current-point {
    font-size: 16px;
    font-weight: 600;
    padding-left: 25px;
  }
}
.w175 {
  max-width: 175px;
}
</style>
