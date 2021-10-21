import dayjs from "dayjs";

export const state = () => ({
  member_id: null,
  member_token: null,
  member: {
    email: "",
    password: "",
    passwordConfirmation: "",
    lastName: "",
    firstName: "",
    lastNameKana: "",
    firstNameKana: "",
    gender: 1,
    phone: "",
    birthday: "",
    pref: null,
    postal: "",
    city: "",
    town: "",
    address: "",
    building: "",
    mailMagazine: 1,
    postalDm: 1,
    cardId: "",
    pin: "",
  },
  canEditBirthday: true,
  loading: false,
});

export const mutations = {
  setMemberId: (state, param) => {
    state.member_id = param;
  },
  setMemberToken: (state, param) => {
    state.member_token = param;
  },
  setMember: (state, param) => {
    state.member = param;
  },
  setEmail: (state, param) => {
    state.member.email = param;
  },
  setPassword: (state, param) => {
    state.member.password = param;
  },
  setPasswordConfirmation: (state, param) => {
    state.member.passwordConfirmation = param;
  },
  setLastName: (state, param) => {
    state.member.lastName = param;
  },
  setFirstName: (state, param) => {
    state.member.firstName = param;
  },
  setLastNameKana: (state, param) => {
    state.member.lastNameKana = param;
  },
  setFirstNameKana: (state, param) => {
    state.member.firstNameKana = param;
  },
  setGender: (state, param) => {
    state.member.gender = param;
  },
  setPhone: (state, param) => {
    state.member.phone = param;
  },
  setBirthday: (state, param) => {
    state.member.birthday = param;
  },
  setPref: (state, param) => {
    state.member.pref = param;
  },
  setPostal: (state, param) => {
    state.member.postal = param;
  },
  setCity: (state, param) => {
    state.member.city = param;
  },
  setTown: (state, param) => {
    state.member.town = param;
  },
  setAddress: (state, param) => {
    state.member.address = param;
  },
  setBuilding: (state, param) => {
    state.member.building = param;
  },
  setMailMagazine: (state, param) => {
    state.member.mailMagazine = param;
  },
  setPostalDm: (state, param) => {
    state.member.postalDm = param;
  },
  setCardId: (state, param) => {
    state.member.cardId = param;
  },
  setPin: (state, param) => {
    state.member.pin = param;
  },
  setCanEditBirthday: (state, param) => {
    state.canEditBirthday = param;
  },
  loading(state, value) {
    state.loading = value;
  },
};
export const actions = {
  setMemberId: ({ commit }, param) => {
    commit("setMemberId", param);
  },
  setMemberToken: ({ commit }, param) => {
    commit("setMemberToken", param);
  },
  setMember: ({ dispatch, commit }, param) => {
    commit("setLastName", param.lname);
    commit("setFirstName", param.fname);
    commit("setLastNameKana", param.lkana);
    commit("setFirstNameKana", param.fkana);
    commit("setBirthday", dayjs(param.birthday).format("YYYY-MM-DD"));
    commit("setCanEditBirthday", param.birthday === null);
    commit("setGender", param.gender);
    commit("setPhone", param.tel);
    commit("setPostal", param.zip);
    commit("setPref", param.pref);
    commit("setAddress", param.address);
    commit("setBuilding", param.building);
    commit("setMailMagazine", param.mail_dm);
    commit("setPostalDm", param.post_dm);
  },
  setEmail: ({ dispatch, commit }, param) => {
    commit("setEmail", param);
  },
  setPassword: ({ dispatch, commit }, param) => {
    commit("setPassword", param);
  },
  setCardId: ({ commit }, param) => {
    commit("setCardId", param);
  },
  setPin: ({ commit }, param) => {
    commit("setPin", param);
  },
};

export const getters = {
  memberId: (state) => {
    return state.member_id;
  },
  memberToken: (state) => {
    return state.member_token;
  },
  member: (state, getters, rootState, rootGetters) => {
    return state.member;
  },
  email: (state, getters, rootState, rootGetters) => {
    return state.member.email;
  },
  password: (state, getters, rootState, rootGetters) => {
    return state.member.password;
  },
  passwordConfirmation: (state, getters, rootState, rootGetters) => {
    return state.member.passwordConfirmation;
  },
  lastName: (state, getters, rootState, rootGetters) => {
    return state.member.lastName;
  },
  firstName: (state, getters, rootState, rootGetters) => {
    return state.member.firstName;
  },
  lastNameKana: (state, getters, rootState, rootGetters) => {
    return state.member.lastNameKana;
  },
  firstNameKana: (state, getters, rootState, rootGetters) => {
    return state.member.firstNameKana;
  },
  gender: (state, getters, rootState, rootGetters) => {
    return state.member.gender;
  },
  phone: (state, getters, rootState, rootGetters) => {
    return state.member.phone;
  },
  birthday: (state, getters, rootState, rootGetters) => {
    return state.member.birthday;
  },
  state: (state, getters, rootState, rootGetters) => {
    return state.member.pref;
  },
  postal: (state, getters, rootState, rootGetters) => {
    return state.member.postal;
  },
  city: (state, getters, rootState, rootGetters) => {
    return state.member.city;
  },
  town: (state, getters, rootState, rootGetters) => {
    return state.member.town;
  },
  address: (state, getters, rootState, rootGetters) => {
    return state.member.address;
  },
  building: (state, getters, rootState, rootGetters) => {
    return state.member.building;
  },
  mailMagazine: (state, getters, rootState, rootGetters) => {
    return state.member.mailMagazine;
  },
  postalDm: (state, getters, rootState, rootGetters) => {
    return state.member.postalDm;
  },
  cardId: (state, getters, rootState, rootGetters) => {
    return state.member.cardId;
  },
  pin: (state, getters, rootState, rootGetters) => {
    return state.member.pin;
  },
  memberFormData: (state) => {
    return {
      member_token: state.member_token,
      pref_id: state.member.pref,
      password: state.member.password,
      fname: state.member.firstName,
      lname: state.member.lastName,
      fkana: state.member.firstNameKana,
      lkana: state.member.lastNameKana,
      birthday: state.member.birthday,
      tel: state.member.phone,
      mb_tel: state.member.phone,
      gender: state.member.gender,
      zip: state.member.postal,
      city: state.member.city,
      town: state.member.town,
      address: state.member.address,
      building: state.member.building,
      email: state.member.email,
      mb_mail: state.member.email,
      post_dm: state.member.postalDm,
      mail_dm: state.member.mailMagazine,
      card_id: state.member.card_id,
      pin: state.member.pin,
    };
  },
  canEditBirthday: (state) => state.canEditBirthday,
  loading(state) {
    return state.loading;
  },
};
