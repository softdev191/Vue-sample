<template>
  <div class="fixed-container">
    <Breadcrumb text="HOME > マイページ > 配送先住所の登録・変更" />
    <div class="mypage-layout">
      <SideMenu />
      <div class="mypage-main">
        <PageTitle>お届け先の登録・変更手続き</PageTitle>
        <div class="address-add-section">
          <p class="text">お届け先を3つまで登録できます。</p>
          <ButtonWrapper theme="normal" class-name="mt20">
            <Button
              theme="dark"
              :disabled="destinations.length >= MAX_COUNT"
              @click="create"
            >
              お届け先を新しく登録する
            </Button>
          </ButtonWrapper>
        </div>
        <section class="address-update-section">
          <div class="address-update-section-title">登録されているお届け先</div>
          <div class="address-update-section-content">
            <div class="address-list-wrapper">
              <ul class="address-list">
                <li
                  v-for="(dst, index) in destinations"
                  :key="index"
                  class="address-list-item"
                >
                  <div class="address-item">
                    <div class="address-item-no">お届け先{{ index + 1 }}</div>
                    <div class="base-table-wrapper">
                      <table class="base-table">
                        <tbody>
                          <tr>
                            <th>氏名</th>
                            <td>{{ dst.lname }} {{ dst.fname }} 様</td>
                          </tr>
                          <tr>
                            <th>氏名（カナ）</th>
                            <td>{{ dst.lkana }} {{ dst.fkana }} 様</td>
                          </tr>
                          <tr>
                            <th>電話番号</th>
                            <td>
                              {{ dst.tel }}
                            </td>
                          </tr>
                          <tr>
                            <th>郵便番号</th>
                            <td>{{ dst.zip }}</td>
                          </tr>
                          <tr>
                            <th>住所</th>
                            <td>
                              {{ dst.pref_id | pref
                              }}{{ `${dst.city}${dst.town}${dst.address}` }}
                              <br />
                              {{ dst.building }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div class="address-button-row mt10">
                    <div class="edit" @click="update(index)">
                      編集する
                      <fa :icon="faChevronRight" />
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="form-group">
              <ButtonWrapper theme="normal">
                <Button theme="light" @click="back">マイページに戻る</Button>
              </ButtonWrapper>
            </div>
          </div>
        </section>
      </div>
    </div>
    <BaseDialog
      ref="createDialog"
      :title="isCreating ? 'お届け先情報の登録' : 'お届け先情報の編集'"
      :has-footer="false"
    >
      <template v-if="newDest">
        <div class="copy-from-user">
          <span @click="handleCopyFromUser">会員情報をコピーする</span>
        </div>
        <ValidationObserver v-slot="observer" ref="obs">
          <div class="form-group-wrapper col-2">
            <TextField
              id="last_name"
              v-model="newDest.lname"
              name="氏"
              rules="max:255|required"
              label="氏"
            />
            <TextField
              id="first_name"
              v-model="newDest.fname"
              name="名"
              rules="max:255|required"
              label="名"
            />
          </div>
          <div class="form-group-wrapper col-2">
            <TextField
              id="last_name_kana"
              v-model="newDest.lkana"
              name="氏（カナ）"
              rules="kana|max:255|required"
              label="氏（カナ）"
            />
            <TextField
              id="first_name_kana"
              v-model="newDest.fkana"
              name="名（カナ）"
              rules="kana|max:255|required"
              label="名（カナ）"
            />
          </div>
          <TextField
            id="phone"
            v-model="newDest.tel"
            name="電話番号"
            rules="required|numeric|min:10|max:11"
            label="電話番号"
            placeholder="電話番号を⼊⼒してください"
          />
          <div class="form-group">
            <Postal v-model="newDest.zip" :set-address="setNewAddress" />
          </div>
          <SelectField
            id="pref_id"
            v-model="newDest.pref_id"
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
                :selected="prefItem.id === newDest.pref_id"
              >
                {{ prefItem.name }}
              </option>
            </template>
          </SelectField>
          <TextField
            id="city"
            v-model="newDest.city"
            type="text"
            name="市区町村"
            rules="required"
            placeholder="市区町村を⼊⼒してください(必須)"
            wrapper-class="form-group mb10"
            input-class="form-control"
          />
          <TextField
            id="town"
            v-model="newDest.town"
            type="text"
            name="町域"
            rules="required"
            placeholder="町域を⼊⼒してください(必須)"
            wrapper-class="form-group mb10"
            input-class="form-control"
          />
          <TextField
            id="address"
            v-model="newDest.address"
            type="text"
            name="住所"
            rules="required"
            placeholder="住所を⼊⼒してください(必須)"
            wrapper-class="form-group mb10"
            input-class="form-control"
          />
          <TextField
            id="building"
            v-model="newDest.building"
            type="text"
            name="ビル・マンション"
            placeholder="ビル・マンション名等あれば⼊⼒してください"
            wrapper-class="form-group mb10"
            input-class="form-control"
          />
          <div v-if="isCreating === true" class="form-group mb0">
            <ButtonWrapper theme="normal">
              <Button
                theme="dark"
                :disabled="observer.invalid"
                :pending="pending"
                @click="onCreate"
              >
                登録する
              </Button>
            </ButtonWrapper>
          </div>
          <div v-else-if="isCreating === false" class="form-group mb0">
            <ButtonWrapper theme="flex">
              <Button theme="light" @click="onDestroy">削除する</Button>
              <Button
                theme="dark"
                :disabled="observer.invalid"
                :pending="pending"
                @click="onUpdate"
              >
                更新する
              </Button>
            </ButtonWrapper>
          </div>
        </ValidationObserver>
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import PageTitle from "@/components/atoms/PageTitle";
import BaseDialog from "@/components/atoms/BaseDialog";
import Breadcrumb from "@/components/partials/Breadcrumb";
import SideMenu from "@/components/pages/mypage/SideMenu";
import TextField from "@/components/atoms/TextField";
import SelectField from "@/components/atoms/SelectField";
import Postal from "@/components/atoms/Postal";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";

export default {
  components: {
    PageTitle,
    BaseDialog,
    Breadcrumb,
    SideMenu,
    TextField,
    SelectField,
    Postal,
    ButtonWrapper,
    Button,
  },
  async fetch() {
    await Promise.all([
      this.$store.dispatch("master/fetch"),
      this.$store.dispatch("destination/fetch"),
    ]);
  },
  data() {
    return {
      newDest: {
        lname: "",
        fname: "",
        lkana: "",
        fkana: "",
        tel: "",
        zip: "",
        pref_id: 1,
        city: "",
        town: "",
        address: "",
        building: "",
      },
      MAX_COUNT: 3,
      isCreating: null,
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
      pending: "common/pending",
    }),
    hasError() {
      return this.errors !== undefined;
    },
    faChevronRight() {
      return faChevronRight;
    },
  },
  methods: {
    initNewDest() {
      this.newDest = {
        lname: "",
        fname: "",
        lkana: "",
        fkana: "",
        tel: "",
        zip: "",
        pref_id: 1,
        city: "",
        town: "",
        address: "",
        building: "",
      };
    },
    create() {
      this.isCreating = true;
      this.$refs.obs.reset();
      this.initNewDest();
      this.$refs.createDialog.show();
    },
    async onCreate() {
      this.$store.commit("common/pending", true);
      await this.$store.dispatch("destination/create", this.newDest);
      this.$refs.createDialog.hide();
      this.isCreating = null;
      this.$store.commit("common/pending", false);
    },
    update(id) {
      this.isCreating = false;
      this.initNewDest();
      this.newDest = Object.assign({}, this.destinations[id]);
      if (this.newDest !== undefined) {
        this.$refs.createDialog.show();
      }
    },
    async onUpdate() {
      this.$store.commit("common/pending", true);
      await this.$store.dispatch("destination/update", this.newDest);
      this.$refs.createDialog.hide();
      this.isCreating = null;
      this.$forceUpdate();
      this.$store.commit("common/pending", false);
    },
    onDestroy() {
      this.$store.dispatch("destination/delete", this.newDest.id);
      this.$refs.createDialog.hide();
      this.isCreating = null;
    },
    setNewAddress(client) {
      if (client) {
        this.newDest.zip = client.postal;
        this.newDest.pref_id = client.pref_id;
        this.newDest.city = client.city;
        this.newDest.town = client.town;
        this.newDest.address = client.address;
        this.newDest.building = client.building;
      }
    },
    handleCopyFromUser() {
      if (!this.user) {
        return;
      }

      this.$set(this.newDest, "lname", this.user.lname);
      this.$set(this.newDest, "fname", this.user.fname);
      this.$set(this.newDest, "lkana", this.user.lkana);
      this.$set(this.newDest, "fkana", this.user.fkana);
      this.$set(this.newDest, "tel", this.user.tel);
      this.$set(this.newDest, "zip", this.user.zip);
      this.$set(this.newDest, "pref_id", this.user.pref_id);
      this.$set(this.newDest, "city", this.user.city);
      this.$set(this.newDest, "town", this.user.town);
      this.$set(this.newDest, "address", this.user.address);
      this.$set(this.newDest, "building", this.user.building || null);
    },
    back() {
      this.$router.push("/mypage");
    },
  },
  head() {
    return {
      title: "配送先住所の登録・変更",
    };
  },
};
</script>

<style lang="scss" scoped>
.text {
  font-size: 12px;
}
.address-add-section {
  margin-bottom: 50px;
}
.address-update-section {
  margin: 0 -5px;
  .address-update-section-title {
    font-size: 14px;
    border-bottom: 1px solid $black;
    margin-bottom: 16px;
    padding: 0 5px;
  }
}
.address-list-wrapper {
  > .address-list {
    > .address-list-item {
      margin-bottom: 30px;
      > .address-item {
        > .address-item-no {
          font-size: 14px;
          padding: 0 5px;
        }
      }
    }
  }
}
.address-button-row {
  text-align: right;
  .edit {
    display: inline-block;
    font-size: 10px;
    border-bottom: 1px solid $black;
    cursor: pointer;
  }
}
.mb10 {
  margin-bottom: 10px;
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
