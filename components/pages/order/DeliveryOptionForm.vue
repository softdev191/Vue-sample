<template>
  <ValidationObserver
    ref="observer"
    v-slot="{ validate }"
    tag="div"
    class="transport-info-wrapper"
    @update:flags="(value) => $emit('update:validation', value)"
  >
    <p class="transport-title">配送会社</p>
    <div class="transport-company">
      <div
        v-for="(deliveryType, index) in deliveryTypes"
        :key="index"
        class="form-radio-wrapper"
      >
        <label class="form-label" :for="`transport_company${index}`">
          {{ deliveryType.label }}
        </label>
      </div>
    </div>
    <p class="transport-title">お届け希望日時</p>
    <div v-show="canSpecifySchedule">
      <p class="transport-date-note fs10 mb16">
        ※最短での出荷をご希望の場合は、日付を選択しないでください。下部の6.ご要望で「最短指定日希望」を選択してください。<br />
        ※地域によっては時間のご指定を頂いておりましても、輸送ルートの関係上期待にそえない場合がございます。
      </p>
      <ValidationProvider
        tag="div"
        class="form-radio-group"
        vid="transport_has_time"
      >
        <div
          v-for="(hasTime, index) in hasTimes"
          :key="index"
          class="form-radio-wrapper mb10"
        >
          <input
            :id="`transport_has_time_${index}`"
            v-model="inputs.delivery_has_time"
            class="form-checkbox"
            type="radio"
            name="transport_has_time"
            :value="Number(hasTime.value)"
            @input="validate"
          />
          <label class="form-label" :for="`transport_has_time_${index}`">
            {{ hasTime.label }}
          </label>
        </div>
      </ValidationProvider>
      <div
        v-show="Number(inputs.delivery_has_time)"
        class="form-group-wrapper col-2"
      >
        <div class="form-group">
          <ValidationProvider
            v-slot="{ dirty, invalid, errors }"
            vid="transport_date"
            name="日付を入力"
            rules="required_if:transport_has_time,1"
          >
            <DatePicker
              id="transport_date"
              v-model="inputs.delivery_hope_date"
              type="text"
              name="transport_date"
              :disabled-dates="disabledDates"
              input-class="form-control"
              :class-name="dirty && invalid ? 'error' : ''"
            />
            <div v-if="dirty && invalid && errors[0]" class="error error-msg">
              {{ errors[0] }}
            </div>
          </ValidationProvider>
        </div>
        <div class="form-group">
          <SelectField
            v-model="inputs.delivery_hope_time"
            vid="delivery_time"
            valid-name="時間帯を入力"
            rules="required_if:transport_has_time,1"
            name="delivery_time"
            :use-unselect-option="true"
            :unselect-option="{ id: null, name: '時間帯を入力' }"
            :option-items="deliveryTypeOptions"
          />
        </div>
      </div>
    </div>
    <div v-show="!canSpecifySchedule">
      <template v-if="isReserved">
        予約商品については、お届け日時を指定することができません。<br />
        入荷予定時期は商品ページに記載しております。<br />
        ご確認いただきますようお願いいたします。
      </template>
      <template v-if="isBackOrdered">
        取寄商品については、商品のお届け日時を指定することができません。<br />
        商品状態の確認を含め、通常7日程度のお時間をいただいております。<br />
        何卒ご了承いただきますようお願いいたします。
      </template>
    </div>
  </ValidationObserver>
</template>

<script>
import { mapGetters } from "vuex";
import SelectField from "@/components/atoms/SelectField";

export default {
  components: {
    SelectField,
  },
  props: {
    inputs: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    const toDate = new Date();
    const addToDate =
      this.$store.state.master.constants.order.delivery_date.to - 1;
    toDate.setDate(toDate.getDate() + addToDate);
    const fromDate = new Date();
    fromDate.setDate(
      fromDate.getDate() +
        this.$store.state.master.constants.order.delivery_date.from
    );
    return {
      disabledDates: {
        to: toDate,
        from: fromDate,
      },
    };
  },
  computed: {
    ...mapGetters({
      enumOptions: "enum/options",
      deliveryTypes: "master/orderDeliveryTypes",
      hasTimes: "master/orderHasTimes",
      isReserved: "cart/isReserved",
      isBackOrdered: "cart/isBackOrdered",
    }),
    deliveryTypeOptions() {
      return this.enumOptions.order__delivery_time || [];
    },
    canSpecifySchedule() {
      return !this.isReserved && !this.isBackOrdered;
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
.transport-info-wrapper {
  position: relative;
  .transport-title {
    font-size: 10px;
    font-weight: 600;
    margin-bottom: 6px;
  }
  .transport-company {
    font-size: 14px;
    margin-bottom: 30px;
    vertical-align: middle;
    img {
      vertical-align: middle;
    }
  }
  .transport-date-note {
    padding-left: 1em;
    text-indent: -1em;
  }
  .transport-date-note::before {
    content: "※";
    display: inline-block;
    margin-right: -2px;
    margin-left: 10px;
  }
  .transport-time {
    font-size: 10px;
  }
  .edit-button-row {
    position: absolute;
    right: 0;
    bottom: 0;
  }
}
</style>
