<template>
  <ValidationObserver
    v-if="inputs"
    @update:flags="(value) => $emit('update:validation', value)"
  >
    <form>
      <div v-if="showCopyInfo" class="copy-from-user">
        <span @click="handleCopyFromUser">会員情報をコピーする</span>
      </div>
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
              v-model="inputs.lname"
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
              v-model="inputs.fname"
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
              v-model="inputs.lkana"
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
              v-model="inputs.fkana"
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
            v-model="inputs.tel"
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
        <Postal
          ref="editPostal"
          v-model="inputs.zip"
          :set-address="zipCodeSearchedHandler"
        ></Postal>
      </div>
      <div class="form-group">
        <label class="form-label">住所</label>
        <div class="form-select-wrapper md mb10">
          <ValidationProvider
            v-slot="{ dirty, invalid, errors }"
            vid="pref_id"
            name="都道府県"
            rules="required"
          >
            <select
              id="pref_id"
              v-model="inputs.pref_id"
              class="form-control"
              :class="[dirty && invalid ? 'error' : '']"
            >
              <option :value="null">都道府県</option>
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
            v-model="inputs.city"
            class="form-control mb10"
            :class="[dirty && invalid ? 'error' : '']"
            type="text"
            name="address"
            placeholder="市区町村を⼊⼒してください (必須)"
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
            v-model="inputs.town"
            class="form-control mb10"
            :class="[dirty && invalid ? 'error' : '']"
            type="text"
            name="address"
            placeholder="町域を⼊⼒してください (必須)"
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
            v-model="inputs.address"
            class="form-control mb10"
            :class="[dirty && invalid ? 'error' : '']"
            type="text"
            name="address"
            placeholder="住所を⼊⼒してください (必須)"
          />
          <div class="error error-msg">{{ errors[0] }}</div>
        </ValidationProvider>
        <input
          id="building"
          v-model="inputs.building"
          class="form-control"
          type="text"
          name="building"
          placeholder="ビル・マンション名等あれば⼊⼒してください"
        />
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import Postal from "@/components/atoms/Postal";

export const createNewInputs = () => ({
  lname: null,
  fname: null,
  lkana: null,
  fkana: null,
  tel: null,
  zip: null,
  pref_id: null,
  city: null,
  town: null,
  address: null,
  building: null,
});

export default {
  components: {
    Postal,
  },
  props: {
    inputs: {
      type: Object,
      default: null,
    },
    showCopyInfo: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      error: null,
    };
  },
  computed: {
    ...mapState({
      user(state) {
        return state.auth.user;
      },
    }),
    ...mapGetters({
      destinations: "destination/destinations",
      prefs: "master/prefs",
      prefIdStrings: "master/prefIdStrings",
    }),
  },
  methods: {
    zipCodeSearchedHandler(client) {
      if (!client) {
        return;
      }

      this.$set(this.inputs, "zip", client.postal);
      this.$set(this.inputs, "pref_id", client.pref_id);
      this.$set(this.inputs, "city", client.city);
      this.$set(this.inputs, "town", client.town);
      this.$set(this.inputs, "address", client.address);
      this.$set(this.inputs, "building", client.building || null);
    },
    handleCopyFromUser() {
      if (!this.user) {
        return;
      }

      this.$set(this.inputs, "lname", this.user.lname);
      this.$set(this.inputs, "fname", this.user.fname);
      this.$set(this.inputs, "lkana", this.user.lkana);
      this.$set(this.inputs, "fkana", this.user.fkana);
      this.$set(this.inputs, "tel", this.user.tel);
      this.$set(this.inputs, "zip", this.user.zip);
      this.$set(this.inputs, "pref_id", this.user.pref_id);
      this.$set(this.inputs, "city", this.user.city);
      this.$set(this.inputs, "town", this.user.town);
      this.$set(this.inputs, "address", this.user.address);
      this.$set(this.inputs, "building", this.user.building || null);
    },
  },
};
</script>

<style lang="scss" scoped>
.address-list-item {
  margin-bottom: 30px;
}

.form-select-wrapper {
  @include touch {
    width: 230px;
  }
}
.tel-alert {
  font-size: 10px;
}
.copy-from-user {
  text-align: right;
  span {
    font-size: 12px;
    border-bottom: 1px solid $black;
  }
}
.copy-from-user:hover {
  cursor: pointer;
  opacity: 0.8;
}
</style>
