<template>
  <div>
    <div class="address-list-wrapper">
      <ul class="address-list">
        <li
          v-for="(address, index) in destinations"
          :key="index"
          class="address-list-item"
        >
          <div class="address-item">
            <div class="form-group">
              <div class="form-radio-wrapper">
                <input
                  :id="'address_id' + index"
                  v-model="destinationId"
                  class="form-checkbox"
                  type="radio"
                  name="address_id"
                  :value="address.id"
                />
                <label class="form-label" :for="'address_id' + index">
                  お届け先{{ index + 1 }}に送る
                </label>
              </div>
            </div>
            <AddressTable :client="address"></AddressTable>
            <div class="edit-row">
              <span @click="handleClickUpdateAddress(address)">
                編集する
                <fa :icon="faChevronRight" />
              </span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="address-new-row">
      <span @click="handleClickCreateAddress">
        別のお届け先を登録する
        <fa :icon="faChevronRight" />
      </span>
    </div>
    <BaseDialog
      ref="createAddressDialog"
      title="お届け先情報の登録"
      :has-cancel="false"
      ok-text="登録する"
      @ok="onCreateAddress"
    >
      <ErrorBox v-if="error" :title="error.title">
        <li v-for="(msg, index) in error.message" :key="index">
          {{ msg }}
        </li>
      </ErrorBox>
      <AddressForm :inputs="newAddress" />
    </BaseDialog>
    <BaseDialog
      ref="updateAddressDialog"
      title="お届け先情報の編集"
      :has-cancel="false"
      ok-text="更新する"
      @ok="onUpdateAddress"
    >
      <ErrorBox v-if="error" :title="error.title">
        <li v-for="(msg, index) in error.message" :key="index">
          {{ msg }}
        </li>
      </ErrorBox>
      <AddressForm :inputs="editAddress" />
    </BaseDialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import BaseDialog from "@/components/atoms/BaseDialog";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import AddressTable from "@/components/atoms/AddressTable";
import { extractFlatValidationError } from "@/plugins/vee-validate";
import AddressForm, {
  createNewInputs,
} from "@/components/pages/order/AddressForm.vue";

export default {
  name: "OrderAddressForm",
  components: {
    AddressTable,
    BaseDialog,
    AddressForm,
  },
  props: {
    value: {
      type: Number,
      default: null,
    },
    canSpecify: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      error: null,
      newAddress: {},
      editAddress: {},
    };
  },
  computed: {
    ...mapGetters({
      destinations: "destination/destinations",
    }),
    destinationId: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    faChevronRight() {
      return faChevronRight;
    },
  },
  methods: {
    initNewAddress() {
      this.newAddress = createNewInputs();
    },
    handleClickCreateAddress() {
      this.initNewAddress();
      this.$refs.createAddressDialog.show();
    },
    async onCreateAddress() {
      try {
        this.$store.commit("common/pending", true);
        this.error = null;
        await this.$store.dispatch("destination/create", this.newAddress);
        this.$refs.createAddressDialog.hide();
        this.initNewAddress();

        if (this.destinations.length === 1) {
          this.destinationId = this.destinations[0].id;
        }
      } catch (error) {
        this.error = {
          title: "お届け先情報の追加に失敗しました。",
          message: extractFlatValidationError(error),
        };
      } finally {
        this.$store.commit("common/pending", false);
      }
    },
    handleClickUpdateAddress(address) {
      this.editAddress = Object.assign({}, address);
      this.$refs.updateAddressDialog.show();
    },
    async onUpdateAddress() {
      try {
        this.$store.commit("common/pending", true);
        this.error = null;
        await this.$store.dispatch("destination/update", this.editAddress);
        this.$refs.updateAddressDialog.hide();
      } catch (error) {
        this.error = {
          title: "お届け先情報の編集に失敗しました。",
          message: extractFlatValidationError(error),
        };
      } finally {
        this.$store.commit("common/pending", false);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.address-list-wrapper {
  .address-list {
    .address-list-item {
      margin-bottom: 30px;
    }
  }
}
.address-new-row {
  text-align: right;
  span {
    font-size: 12px;
  }
}
.edit-row {
  text-align: right;
  margin-top: 10px;
}
.form-select-wrapper {
  @include touch {
    width: 230px;
  }
}
.eye {
  margin-left: 13px;
  text-decoration: none;
  border-bottom: 1px solid black;
  padding-bottom: 5px;
}
.eye:hover {
  cursor: pointer;
  opacity: 0.8;
}
</style>
