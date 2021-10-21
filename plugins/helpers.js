import Vue from "vue";

Vue.filter("number_to_yen", function (value) {
  return value.toLocaleString() + "円";
});

Vue.filter("tag_names", function (arr) {
  return arr.map((el) => el.name).join(" / ");
});
