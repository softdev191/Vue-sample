<template>
  <div v-if="destination" class="base-table-wrapper">
    <div v-if="title" class="base-table-title fs10">請求先</div>
    <table class="base-table">
      <tbody>
        <tr>
          <th>お名前</th>
          <td>{{ `${destination.name} 様` }}</td>
        </tr>
        <tr>
          <th>郵便番号</th>
          <td>{{ destination.postal_code }}</td>
        </tr>
        <tr>
          <th>住所</th>
          <td>
            {{ address }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    destination: {
      type: Object,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
  },
  computed: {
    address() {
      const destination = this.destination;

      if (!destination) {
        return "";
      }

      return `${destination.pref_name}${destination.address_line1 || ""}${
        destination.address_line2 || ""
      }${destination.address_line3 || ""}`;
    },
  },
};
</script>
