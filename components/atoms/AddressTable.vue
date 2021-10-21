<template>
  <div v-if="client" class="base-table-wrapper">
    <div v-if="title" class="base-table-title fs10">請求先</div>
    <table class="base-table">
      <tbody>
        <tr>
          <th>お名前</th>
          <td>{{ `${client.lname} ${client.fname} 様` }}</td>
        </tr>
        <tr>
          <th>お名前（カナ）</th>
          <td>
            {{ `${client.lkana} ${client.fkana} 様` }}
          </td>
        </tr>
        <tr>
          <th>電話番号</th>
          <td>{{ client.tel }}</td>
        </tr>
        <tr>
          <th>郵便番号</th>
          <td>{{ client.zip }}</td>
        </tr>
        <tr>
          <th>住所</th>
          <td>
            {{ prefName + client.city + client.town + client.address }}<br />
            {{ client.building }}
          </td>
        </tr>
        <tr v-if="showEmail">
          <th>メールアドレス</th>
          <td>
            {{ client.email }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    client: {
      type: Object,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    showEmail: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState({
      prefName(state, getters) {
        return getters["master/prefNameById"](this.client.pref_id);
      },
    }),
  },
};
</script>
