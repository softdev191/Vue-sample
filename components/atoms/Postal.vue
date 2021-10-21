<template>
  <ValidationProvider
    v-slot="{ dirty, invalid, errors }"
    vid="postal"
    name="郵便番号"
    rules="required|digits:7"
  >
    <label class="form-label" for="postal">郵便番号</label>
    <input
      id="postal"
      v-model="innerValue"
      class="form-control md"
      :class="[dirty && invalid ? 'error' : '']"
      type="text"
      name="postal"
      placeholder="郵便番号を⼊⼒してください"
    />
    <span id="get-postal" class="eye" @click="updatePostal">住所検索</span>
    <div class="postal-alert">※ハイフンなし</div>
    <div id="postal-error" class="error error-msg">
      {{ errors[0] }}
    </div>
  </ValidationProvider>
</template>

<script>
import formFieldMixin from "@/components/molecules/form/mixins/formFieldMixin";

export default {
  mixins: [formFieldMixin],
  props: {
    setAddress: {
      type: Function,
      default: null,
    },
  },
  methods: {
    updatePostal() {
      if (process.client) {
        /* eslint-disable */
        const self = this;
        ZipCodeJp.setZipCodeBaseUrl(
          "https://stg-members.ymdy.co.jp/zip_code"
        );
        ZipCodeJp.getAddressesOfZipCode(this.innerValue, function (err, addresses) {
          let errorText = "";
          if (err) {
            console.error(err);
            errorText = "住所検索に失敗しました。";
          }
          document.getElementById("postal-error").textContent = errorText;
          if (addresses.length > 0) {
            const address = addresses[0];
            const client = {};
            client.postal = self.innerValue;
            client.pref_id = Number(address.prefecture_jis_code);
            client.city = address.city_name;
            client.town = address.town_name;
            client.address = "";
            client.building = "";
            self.setAddress(client);
          }
        });
        /* eslint-enable */
      }
    },
  },
};
</script>
<style lang="scss" scoped>
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
.postal-alert {
  font-size: 10px;
}
</style>
