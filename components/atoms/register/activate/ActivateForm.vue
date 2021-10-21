<template>
  <div class="form-wrapper">
    <ValidationObserver v-slot="observer" ref="obs">
      <form>
        <section class="form-section">
          <div class="form-section-title">① アカウント情報</div>
          <div class="form-section-content">
            <div class="form-group">
              <label class="form-label">メールアドレス</label>
              <Loading
                v-if="loading"
                :type="TYPE_INDICATOR"
                class="loading"
                :size="2"
              />
              <label class="form-label">{{ email }}</label>
            </div>
            <Password
              id="password"
              v-model="password"
              class="form-group"
              :input-class="['form-control password']"
            />
            <Password
              id="password_confirmation"
              v-model="passwordConfirmation"
              class="form-group"
              label="パスワード（確認用）"
              rules="required|password|need_alpha_num|min:8|confirmed:password"
              :input-class="['form-control password']"
              :info-text="false"
            />
            <div class="form-group-wrapper col-2">
              <TextField
                id="last_name"
                v-model="lastName"
                type="text"
                name="氏"
                rules="max:255|required"
                label="氏"
              />
              <TextField
                id="first_name"
                v-model="firstName"
                type="text"
                name="名"
                rules="max:255|required"
                label="名"
              />
            </div>
            <div class="form-group-wrapper col-2">
              <TextField
                id="last_name_kana"
                v-model="lastNameKana"
                type="text"
                name="氏（カナ）"
                rules="kana|max:255|required"
                label="氏（カナ）"
              />
              <TextField
                id="first_name_kana"
                v-model="firstNameKana"
                type="text"
                name="名（カナ）"
                rules="kana|max:255|required"
                label="名（カナ）"
              />
            </div>
            <ValidationProvider vid="birthday" name="⽣年⽉⽇" rules="required">
              <div class="form-group">
                <label class="form-label" for="birthday">⽣年⽉⽇</label>
                <DateSelect
                  id="birthday"
                  v-model="birthday"
                  info-text="※後から生年月日を変更することはできません。"
                  :disabled="!canEditBirthday"
                />
              </div>
            </ValidationProvider>
            <div class="form-group">
              <label class="form-label">性別</label>
              <div class="form-radio-group flex">
                <div
                  v-for="genderType in genderTypes"
                  :key="genderType.key"
                  class="form-radio-wrapper"
                >
                  <input
                    :id="genderType.key"
                    v-model="gender"
                    class="form-checkbox"
                    type="radio"
                    name="gender"
                    :value="genderType.value"
                  />
                  <label class="form-label" :for="genderType.key">
                    {{ genderType.label }}
                  </label>
                </div>
              </div>
              <p class="form-text">※後から性別を変更することはできません。</p>
            </div>
          </div>
        </section>
        <section class="form-section">
          <div class="form-section-title">② 会員情報</div>
          <div class="form-section-content">
            <p class="fs12 mb25">
              ご購⼊頂いた商品を届けるために必要になります。アカウント作成後、お届け先情報の修正や、複数登録することができます。
            </p>
            <TextField
              id="phone"
              v-model="phone"
              type="text"
              name="電話番号"
              rules="required|numeric|min:10|max:11"
              label="電話番号"
              placeholder="電話番号を⼊⼒してください"
              info-text="※ハイフンなし"
            />
            <div class="form-group">
              <Postal v-model="postal" :set-address="setAddress" />
            </div>
            <SelectField
              id="state"
              v-model="pref"
              type="text"
              name="都道府県"
              rules="required"
              label="住所"
              wrapper-class="form-group mb10"
              select-wrapper-class="select-wrapper md mb10"
              :use-unselect-option="true"
              :unselect-option="{ id: null, name: '都道府県' }"
            >
              <template #options>
                <option
                  v-for="prefItem in prefs"
                  :key="prefItem.id"
                  :value="prefItem.id"
                  :selected="prefItem.id === pref"
                >
                  {{ prefItem.name }}
                </option>
              </template>
            </SelectField>
            <TextField
              id="city"
              v-model="city"
              type="text"
              name="市区町村"
              rules="required"
              placeholder="市区町村を⼊⼒してください(必須)"
              wrapper-class="form-group mb10"
              input-class="form-control"
            />
            <TextField
              id="town"
              v-model="town"
              type="text"
              name="町域"
              rules="required"
              placeholder="町域を⼊⼒してください(必須)"
              wrapper-class="form-group mb10"
              input-class="form-control"
            />
            <TextField
              id="address"
              v-model="address"
              type="text"
              name="住所"
              rules="required"
              placeholder="住所を⼊⼒してください(必須)"
              wrapper-class="form-group mb10"
              input-class="form-control"
            />
            <TextField
              id="building"
              v-model="building"
              type="text"
              name="ビル・マンション"
              placeholder="ビル・マンション名等あれば⼊⼒してください"
              wrapper-class="form-group mb10"
              input-class="form-control"
            />
          </div>
        </section>
        <section class="form-section">
          <div class="form-section-title">③ メールマガジン登録</div>
          <div class="form-section-content">
            <p class="fs12 mb20">
              商品⼊荷情報や、お得なイベント情報、クーポン等を受け取ることができます。
            </p>
            <div class="form-group">
              <div class="form-radio-group">
                <div
                  v-for="mailDmType in mailDmTypes"
                  :key="mailDmType.key"
                  class="form-radio-wrapper"
                >
                  <input
                    :id="`maildm_${mailDmType.key}`"
                    v-model="mailMagazine"
                    class="form-checkbox"
                    type="radio"
                    name="mail_magazine"
                    :value="mailDmType.value"
                  />
                  <label class="form-label" :for="'maildm_' + mailDmType.key">
                    {{ mailDmType.label }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section class="form-section">
          <div class="form-section-title">④ 郵便DM登録</div>
          <div class="form-section-content">
            <p class="fs12 mb20">
              商品⼊荷情報や、お得なイベント情報、クーポン等を受け取ることができます。
            </p>
            <div class="form-group">
              <div class="form-radio-group flex">
                <div
                  v-for="postDmType in postDmTypes"
                  :key="postDmType.key"
                  class="form-radio-wrapper"
                >
                  <input
                    :id="`postdm_${postDmType.key}`"
                    v-model="postalDm"
                    class="form-checkbox"
                    type="radio"
                    name="postal_dm"
                    :value="postDmType.value"
                  />
                  <label class="form-label" :for="'postdm_' + postDmType.key">
                    {{ postDmType.label }}
                  </label>
                </div>
              </div>
            </div>
            <div class="form-group">
              <ButtonWrapper theme="normal">
                <Button
                  theme="dark"
                  :disabled="observer.invalid"
                  @click="confirm"
                >
                  {{ submitText }}
                </Button>
              </ButtonWrapper>
            </div>
          </div>
        </section>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Password from "@/components/atoms/Password";
import TextField from "@/components/atoms/TextField";
import DateSelect from "@/components/atoms/DateSelect";
import SelectField from "@/components/atoms/SelectField";
import Postal from "@/components/atoms/Postal";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";
import Loading, {
  TYPE_INDICATOR,
} from "@/components/molecules/loading/Loading";

export default {
  components: {
    Password,
    TextField,
    DateSelect,
    SelectField,
    Postal,
    ButtonWrapper,
    Button,
    Loading,
  },
  props: {
    submitText: {
      type: String,
      default: "次に進む：残り1ステップ",
    },
  },
  data() {
    return {
      TYPE_INDICATOR,
    };
  },
  computed: {
    ...mapGetters({
      genderTypes: "master/genders",
      prefs: "master/prefs",
      mailDmTypes: "master/mailDmTypes",
      postDmTypes: "master/postDmTypes",
      canEditBirthday: "register/activate/canEditBirthday",
      loading: "register/activate/loading",
    }),
    email: {
      get() {
        return this.$store.state.register.activate.member.email;
      },
      set(value) {
        return this.$store.commit("register/activate/setEmail", value);
      },
    },
    password: {
      get() {
        return this.$store.state.register.activate.member.password;
      },
      set(value) {
        return this.$store.commit("register/activate/setPassword", value);
      },
    },
    passwordConfirmation: {
      get() {
        return this.$store.state.register.activate.member.passwordConfirmation;
      },
      set(value) {
        return this.$store.commit(
          "register/activate/setPasswordConfirmation",
          value
        );
      },
    },
    lastName: {
      get() {
        return this.$store.state.register.activate.member.lastName;
      },
      set(value) {
        return this.$store.commit("register/activate/setLastName", value);
      },
    },
    firstName: {
      get() {
        return this.$store.state.register.activate.member.firstName;
      },
      set(value) {
        return this.$store.commit("register/activate/setFirstName", value);
      },
    },
    lastNameKana: {
      get() {
        return this.$store.state.register.activate.member.lastNameKana;
      },
      set(value) {
        return this.$store.commit("register/activate/setLastNameKana", value);
      },
    },
    firstNameKana: {
      get() {
        return this.$store.state.register.activate.member.firstNameKana;
      },
      set(value) {
        return this.$store.commit("register/activate/setFirstNameKana", value);
      },
    },
    gender: {
      get() {
        return this.$store.state.register.activate.member.gender;
      },
      set(value) {
        return this.$store.commit("register/activate/setGender", value);
      },
    },
    phone: {
      get() {
        return this.$store.state.register.activate.member.phone;
      },
      set(value) {
        return this.$store.commit("register/activate/setPhone", value);
      },
    },
    birthday: {
      get() {
        return this.$store.state.register.activate.member.birthday;
      },
      set(value) {
        return this.$store.commit("register/activate/setBirthday", value);
      },
    },
    pref: {
      get() {
        return this.$store.state.register.activate.member.pref;
      },
      set(value) {
        return this.$store.commit("register/activate/setPref", value);
      },
    },
    postal: {
      get() {
        return this.$store.state.register.activate.member.postal;
      },
      set(value) {
        return this.$store.commit("register/activate/setPostal", value);
      },
    },
    city: {
      get() {
        return this.$store.state.register.activate.member.city;
      },
      set(value) {
        return this.$store.commit("register/activate/setCity", value);
      },
    },
    town: {
      get() {
        return this.$store.state.register.activate.member.town;
      },
      set(value) {
        return this.$store.commit("register/activate/setTown", value);
      },
    },
    address: {
      get() {
        return this.$store.state.register.activate.member.address;
      },
      set(value) {
        return this.$store.commit("register/activate/setAddress", value);
      },
    },
    building: {
      get() {
        return this.$store.state.register.activate.member.building;
      },
      set(value) {
        return this.$store.commit("register/activate/setBuilding", value);
      },
    },
    mailMagazine: {
      get() {
        return this.$store.state.register.activate.member.mailMagazine;
      },
      set(value) {
        return this.$store.commit("register/activate/setMailMagazine", value);
      },
    },
    postalDm: {
      get() {
        return this.$store.state.register.activate.member.postalDm;
      },
      set(value) {
        return this.$store.commit("register/activate/setPostalDm", value);
      },
    },
  },
  methods: {
    setAddress(client) {
      if (client) {
        this.$store.commit("register/activate/setPostal", client.postal);
        this.$store.commit("register/activate/setPref", client.pref_id);
        this.$store.commit("register/activate/setCity", client.city);
        this.$store.commit("register/activate/setTown", client.town);
        this.$store.commit("register/activate/setAddress", client.address);
        this.$store.commit("register/activate/setBuilding", client.building);
      }
    },
    confirm() {
      this.$emit("confirm");
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
  font-size: 10px;
  border-bottom: 1px solid $black;
  margin-left: 10px;
  cursor: pointer;
}
</style>
