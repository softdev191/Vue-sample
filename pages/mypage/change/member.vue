<template>
  <div class="fixed-container">
    <ErrorBox v-if="error">{{ error }}</ErrorBox>
    <Breadcrumb text="HOME > マイページ > 会員情報変更" />
    <div class="mypage-layout">
      <SideMenu />
      <ValidationObserver v-slot="observer" ref="obs">
        <div class="mypage-main">
          <PageTitle>会員情報変更</PageTitle>
          <section class="member-update-section">
            <div class="update-form">
              <div class="form-group-wrapper col-2">
                <TextField
                  id="last_name"
                  v-model="lastName"
                  name="氏"
                  rules="max:255|required"
                  label="氏"
                />
                <TextField
                  id="first_name"
                  v-model="firstName"
                  name="名"
                  rules="max:255|required"
                  label="名"
                />
              </div>
              <div class="form-group-wrapper col-2">
                <TextField
                  id="last_name_kana"
                  v-model="lastNameKana"
                  name="氏（カナ）"
                  rules="kana|max:255|required"
                  label="氏（カナ）"
                />
                <TextField
                  id="first_name_kana"
                  v-model="firstNameKana"
                  name="名（カナ）"
                  rules="kana|max:255|required"
                  label="名（カナ）"
                />
              </div>
              <TextField
                id="phone"
                v-model="phone"
                name="電話番号"
                rules="required|numeric|min:10|max:11"
                label="電話番号"
                placeholder="電話番号を⼊⼒してください"
              />
              <div class="form-group">
                <Postal
                  ref="editPostal"
                  v-model="postal"
                  :set-address="setAddress"
                />
              </div>
              <SelectField
                id="pref_id"
                v-model="pref_id"
                type="text"
                name="都道府県"
                rules="required"
                label="住所"
                wrapper-class="form-group mb10"
                select-wrapper-class="select-wrapper md mb10"
              >
                <template #options>
                  <option
                    v-for="prefItem in prefs"
                    :key="prefItem.id"
                    :value="prefItem.id"
                    :selected="prefItem.id === pref_id"
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
              <div class="form-group">
                <ButtonWrapper theme="normal" class-name="mt30">
                  <Button
                    theme="light"
                    :disabled="observer.invalid"
                    :pending="pending"
                    @click="update"
                  >
                    更新する
                  </Button>
                </ButtonWrapper>
              </div>
            </div>
          </section>
        </div>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import ErrorBox from "@/components/atoms/ErrorBox";
import PageTitle from "@/components/atoms/PageTitle";
import Breadcrumb from "@/components/partials/Breadcrumb";
import SideMenu from "@/components/pages/mypage/SideMenu";
import TextField from "@/components/atoms/TextField";
import SelectField from "@/components/atoms/SelectField";
import Postal from "@/components/atoms/Postal";
import { extractFlatValidationError } from "@/plugins/vee-validate";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";

export default {
  components: {
    ErrorBox,
    PageTitle,
    Breadcrumb,
    SideMenu,
    TextField,
    SelectField,
    Postal,
    ButtonWrapper,
    Button,
  },
  async fetch() {
    await this.$store.dispatch("master/fetch");
    this.loadData();
  },
  data() {
    return {
      lastName: undefined,
      firstName: undefined,
      lastNameKana: undefined,
      firstNameKana: undefined,
      phone: undefined,
      postal: undefined,
      pref_id: undefined,
      city: undefined,
      town: undefined,
      address: undefined,
      building: undefined,
      orderInfoId: undefined,
      error: null,
    };
  },
  computed: {
    ...mapState({
      user(state, getters) {
        return state.auth.user;
      },
    }),
    ...mapGetters({
      prefs: "master/prefs",
      pending: "common/pending",
    }),
    payload() {
      return {
        id: this.user.id,
        lname: this.lastName,
        fname: this.firstName,
        lkana: this.lastNameKana,
        fkana: this.firstNameKana,
        tel: this.phone,
        zip: this.postal,
        birthday: this.birthday,
        pref_id: this.pref_id,
        city: this.city,
        town: this.town,
        address: this.address,
        building: this.building,
      };
    },
  },
  methods: {
    loadData() {
      this.lastName = this.user.lname;
      this.firstName = this.user.fname;
      this.lastNameKana = this.user.lkana;
      this.firstNameKana = this.user.fkana;
      this.phone = this.user.tel;
      this.postal = this.user.zip;
      if (this.user.pref) {
        this.pref_id = this.user.pref.id;
      }
      this.city = this.user.city;
      this.town = this.user.town;
      this.address = this.user.address;
      this.building = this.user.building;
    },
    setAddress(client) {
      if (client) {
        this.postal = client.postal;
        this.pref_id = client.pref_id;
        this.city = client.city;
        this.town = client.town;
        this.address = client.address;
        this.building = client.building;
      }
    },
    async update() {
      try {
        this.$store.commit("common/pending", true);
        await this.$api.update(`member/${this.user.id}`, this.payload);

        await this.$auth.fetchUser();

        this.$router.push({
          path: "/mypage",
          query: { result: "ProfileUpdated" },
        });
      } catch (error) {
        const messages = extractFlatValidationError(error);
        this.error = messages[0];
      } finally {
        this.$store.commit("common/pending", false);
      }
    },
  },
  head() {
    return {
      title: "会員情報変更",
    };
  },
};
</script>

<style lang="scss" scoped>
.text {
  font-size: 12px;
  margin-top: 10px;
}
.search {
  font-size: 10px;
  border-bottom: 1px solid $black;
  margin-left: 10px;
  cursor: pointer;
}
.mb10 {
  margin-bottom: 10px;
}
</style>
