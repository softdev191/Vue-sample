<template>
  <ValidationObserver v-slot="observer" ref="obs">
    <BaseDialog
      ref="updateClientDialog"
      :title="title"
      :has-cancel="false"
      ok-text="更新する"
      :invalid="observer.invalid"
      @ok="onUpdate"
    >
      <template v-if="editClient">
        <ErrorBox v-if="error" :title="error.title">
          <ul>
            <li v-for="(message, index) in error.message" :key="index">
              {{ message }}
            </li>
          </ul>
        </ErrorBox>
        <form>
          <div class="form-group-wrapper col-2">
            <div class="form-group">
              <ValidationProvider
                v-slot="{ dirty, invalid, errors }"
                vid="lname"
                name="氏"
                rules="required|min:1|max:255"
              >
                <label class="form-label" for="lname">氏</label>
                <input
                  id="lname"
                  v-model="editClient.lname"
                  class="form-control"
                  :class="[dirty && invalid ? 'error' : '']"
                  type="text"
                  name="lname"
                />
                <div class="error error-msg">{{ errors[0] }}</div>
              </ValidationProvider>
            </div>
            <div class="form-group">
              <ValidationProvider
                v-slot="{ dirty, invalid, errors }"
                vid="fname"
                name="名"
                rules="required|min:1|max:255"
              >
                <label class="form-label" for="fname">名</label>
                <input
                  id="fname"
                  v-model="editClient.fname"
                  class="form-control"
                  :class="[dirty && invalid ? 'error' : '']"
                  type="text"
                  name="fname"
                />
                <div class="error error-msg">{{ errors[0] }}</div>
              </ValidationProvider>
            </div>
          </div>
          <div class="form-group-wrapper col-2">
            <div class="form-group">
              <ValidationProvider
                v-slot="{ dirty, invalid, errors }"
                vid="lkana"
                name="氏（カナ）"
                rules="required|kana|min:1|max:255"
              >
                <label class="form-label" for="lkana"> 氏（カナ） </label>
                <input
                  id="lkana"
                  v-model="editClient.lkana"
                  class="form-control"
                  :class="[dirty && invalid ? 'error' : '']"
                  type="text"
                  name="lkana"
                />
                <div class="error error-msg">{{ errors[0] }}</div>
              </ValidationProvider>
            </div>
            <div class="form-group">
              <ValidationProvider
                v-slot="{ dirty, invalid, errors }"
                vid="fkana"
                name="名（カナ）"
                rules="required|kana|min:1|max:255"
              >
                <label class="form-label" for="fkana"> 名（カナ）</label>
                <input
                  id="fkana"
                  v-model="editClient.fkana"
                  class="form-control"
                  :class="[dirty && invalid ? 'error' : '']"
                  type="text"
                  name="fkana"
                />
                <div class="error error-msg">{{ errors[0] }}</div>
              </ValidationProvider>
            </div>
          </div>
          <div class="form-group">
            <ValidationProvider
              v-slot="{ dirty, invalid, errors }"
              vid="tel"
              name="電話番号"
              rules="required|numeric|min:10|max:11"
            >
              <label class="form-label" for="tel">電話番号</label>
              <input
                id="tel"
                v-model="editClient.tel"
                class="form-control"
                :class="[dirty && invalid ? 'error' : '']"
                type="text"
                name="tel"
                placeholder="電話番号を⼊⼒してください"
              />
              <div class="tel-alert">※ハイフンなし</div>
              <div class="error error-msg">{{ errors[0] }}</div>
            </ValidationProvider>
          </div>
          <div class="form-group">
            <Postal v-model="editClient.zip" :set-address="setAddress"></Postal>
          </div>
          <div class="form-group">
            <label class="form-label">住所</label>
            <div class="form-select-wrapper md mb10">
              <ValidationProvider
                v-slot="{ dirty, invalid, errors }"
                vid="pref_id"
                name="都道府県"
                :rules="`required|oneOf:${prefIdStrings}`"
              >
                <select
                  id="pref_id"
                  v-model="editClient.pref_id"
                  class="form-control"
                  :class="[dirty && invalid ? 'error' : '']"
                >
                  <option value="0">都道府県を選んでください</option>
                  <option
                    v-for="(pref, index) in prefs"
                    :key="index"
                    class="address-list-item"
                    :value="pref.id"
                  >
                    {{ pref.name }}
                  </option>
                </select>
                <div class="error error-msg">{{ errors[0] }}</div>
              </ValidationProvider>
            </div>
            <ValidationProvider
              v-slot="{ dirty, invalid, errors }"
              vid="city"
              name="市区町村"
              rules="required|min:1|max:255"
            >
              <input
                id="city"
                v-model="editClient.city"
                class="form-control mb10"
                :class="[dirty && invalid ? 'error' : '']"
                type="text"
                name="address"
                placeholder="市区町村を⼊⼒してください"
              />
              <div class="error error-msg">{{ errors[0] }}</div>
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ dirty, invalid, errors }"
              vid="town"
              name="町域"
              rules="required|min:1|max:255"
            >
              <input
                id="town"
                v-model="editClient.town"
                class="form-control mb10"
                :class="[dirty && invalid ? 'error' : '']"
                type="text"
                name="address"
                placeholder="町域を⼊⼒してください"
              />
              <div class="error error-msg">{{ errors[0] }}</div>
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ dirty, invalid, errors }"
              vid="address"
              name="住所"
              rules="required|min:1|max:255"
            >
              <input
                id="address"
                v-model="editClient.address"
                class="form-control mb10"
                :class="[dirty && invalid ? 'error' : '']"
                type="text"
                name="address"
                placeholder="住所を⼊⼒してください"
              />
              <div class="error error-msg">{{ errors[0] }}</div>
            </ValidationProvider>
            <input
              id="building"
              v-model="editClient.building"
              class="form-control"
              type="text"
              name="building"
              placeholder="ビル・マンション名等あれば⼊⼒してください"
            />
          </div>
        </form>
      </template>
    </BaseDialog>
  </ValidationObserver>
</template>

<script>
import { mapState } from "vuex";
import ErrorBox from "@/components/atoms/ErrorBox";
import BaseDialog from "@/components/atoms/BaseDialog";
import Postal from "@/components/atoms/Postal";

export default {
  components: {
    ErrorBox,
    BaseDialog,
    Postal,
  },
  props: {
    client: {
      type: Object,
      default: null,
    },
    title: {
      type: String,
      default: "",
    },
    onUpdateClient: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      error: null,
      editClient: null,
    };
  },
  computed: {
    ...mapState({
      prefs(state, getters) {
        return getters["master/prefs"];
      },
      prefIdStrings(state, getters) {
        return getters["master/prefIdStrings"];
      },
    }),
  },
  methods: {
    show() {
      this.editClient = Object.assign({}, this.client);
      this.$refs.updateClientDialog.show();
    },
    setAddress(client) {
      if (client) {
        this.editClient.zip = client.postal;
        this.editClient.pref_id = client.pref_id;
        this.editClient.city = client.city;
        this.editClient.town = client.town;
        this.editClient.address = client.address;
        this.editClient.building = client.building || null;
      }
    },
    async onUpdate() {
      const error = await this.onUpdateClient(this.editClient);
      if (!error) {
        this.$refs.updateClientDialog.hide();
      }
      this.error = error;
    },
  },
};
</script>
<style lang="scss" scoped>
.form-select-wrapper {
  @include touch {
    width: 230px;
  }
}
.tel-alert {
  font-size: 10px;
}
</style>
