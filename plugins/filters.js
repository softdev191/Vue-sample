import Vue from "vue";
import dayjs from "dayjs";

export default ({ store }) => {
  function formatDate(date, format = "YYYY/MM/DD") {
    if (!date) return "";
    return dayjs(date).format(format);
  }

  function formatDateTime(datetime) {
    if (!datetime) return "";
    return dayjs(datetime).format("YYYY/MM/DD HH:mm");
  }

  function numberFormat(num) {
    if (!num) return "0";
    const formatter = new Intl.NumberFormat("ja-JP");
    return formatter.format(num);
  }

  function enumGender(value) {
    const gender = store.getters["master/genders"].find(
      (gender) => gender.value === Number(value)
    );

    return gender ? gender.label : "";
  }

  function pref(value) {
    const pref = store.getters["master/prefs"].find(
      (pref) => pref.id === Number(value)
    );

    return pref ? pref.name : "";
  }

  function enumPostDm(value) {
    const postDm = store.getters["master/postDmTypes"].find(
      (postDmType) => postDmType.value === Number(value)
    );

    return postDm ? postDm.label : "";
  }

  function enumMailDm(value) {
    const mailDm = store.getters["master/mailDmTypes"].find(
      (mailDmType) => mailDmType.value === Number(value)
    );

    return mailDm ? mailDm.label : "";
  }

  function enumOrderType(value) {
    const orderType = store.getters["master/orderTypes"].find(
      (orderType) => orderType.value === Number(value)
    );

    return orderType ? orderType.label : "";
  }

  Vue.filter("date", formatDate);
  Vue.filter("dateTime", formatDateTime);
  Vue.filter("numberFormat", numberFormat);
  Vue.filter("enumGender", enumGender);
  Vue.filter("pref", pref);
  Vue.filter("enumPostDm", enumPostDm);
  Vue.filter("enumMailDm", enumMailDm);
  Vue.filter("enumOrderType", enumOrderType);
};
