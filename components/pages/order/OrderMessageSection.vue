<template>
  <ValidationObserver
    v-slot="{ validate }"
    class="order-message-section"
    @update:flags="(value) => $emit('update:validation', value)"
  >
    <form>
      <OrderSection :title="title">
        <ValidationProvider tag="div" vid="has_message" class="form-group mb10">
          <div
            v-for="(orderHasMessage, index) in orderHasMessages"
            :key="index"
            class="form-radio-wrapper mb10"
          >
            <input
              :id="`has_message${index}`"
              v-model="inputs.hasMessage"
              class="form-checkbox"
              type="radio"
              name="has_message"
              :value="orderHasMessage.value"
              @input="validate"
            />
            <label class="form-label" :for="`has_message${index}`">
              {{ orderHasMessage.label }}
            </label>
          </div>
        </ValidationProvider>
        <div
          v-show="inputs.hasMessage === existMessageValue"
          class="form-group"
        >
          <div class="mb10">
            <ValidationProvider
              v-slot="{ dirty, invalid, errors }"
              vid="message_type"
              name="ご要望"
              :rules="`required_if:has_message,${existMessageValue}`"
            >
              <select
                id="message_type"
                v-model="inputs.type"
                class="form-control"
                :class="[dirty && invalid ? 'error' : '']"
              >
                <option :value="null">ご要望を選択してください</option>
                <option
                  v-for="(paymentRequest, index) in paymentRequests"
                  :key="index"
                  :value="paymentRequest.value"
                >
                  {{ paymentRequest.label }}
                </option>
              </select>
              <div v-if="dirty && invalid && errors[0]" class="error error-msg">
                {{ errors[0] }}
              </div>
            </ValidationProvider>
          </div>
        </div>
        <p v-show="inputs.hasMessage === existMessageValue" class="fs10 mb10">
          当店へのご要望・ご意見他、自由にお使いください。<br />
          ◯◯についてはご対応しかねます。
        </p>
        <div
          v-show="inputs.hasMessage === existMessageValue"
          class="form-group"
        >
          <ValidationProvider
            v-slot="{ dirty, invalid, errors }"
            vid="message"
            name="ご要望"
            :rules="`max:255|required_if:has_message,${existMessageValue}`"
          >
            <textarea
              id="message"
              v-model="inputs.content"
              class="form-control"
              rows="10"
            ></textarea>
            <div v-if="dirty && invalid && errors[0]" class="error error-msg">
              {{ errors[0] }}
            </div>
          </ValidationProvider>
        </div>
      </OrderSection>
    </form>
  </ValidationObserver>
</template>

<script>
import OrderSection from "@/components/pages/order/OrderSection";
import { mapState } from "vuex";

export default {
  components: {
    OrderSection,
  },
  props: {
    title: {
      type: String,
      default: "6. ご要望",
    },
    inputs: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapState({
      paymentRequests(state, getters) {
        return getters["master/orderRequest"];
      },
      orderRequestStrings(state, getters) {
        return getters["master/orderRequestStrings"];
      },
      orderHasMessages(state, getters) {
        return getters["master/orderHasMessages"];
      },
      existMessageValue(state, getters) {
        const messages = getters["master/orderHasMessages"];
        const message = messages.find((message, index) => {
          return message.key === "Exist";
        });
        return message.value;
      },
    }),
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
  }
}
.w175 {
  max-width: 175px;
}
.order-message-section {
  .order-section {
    padding-bottom: 0;
  }
}
</style>
