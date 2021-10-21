export const state = () => ({
  lastName: null,
  firstName: null,
  birthday: null,
  phone: null,
  email: null,
});

export const mutations = {
  setLastName: (state, param) => {
    state.lastName = param;
  },
  setFirstName: (state, param) => {
    state.firstName = param;
  },
  setBirthday: (state, param) => {
    state.birthday = param;
  },
  setPhone: (state, param) => {
    state.phone = param;
  },
  setEmail: (state, param) => {
    state.email = param;
  },
};
export const actions = {
  setLastName({ commit }, param) {
    commit("setLastName", param);
  },
  setFirstName({ commit }, param) {
    commit("setFirstName", param);
  },
  setBirthday({ commit }, param) {
    commit("setBirthday", param);
  },
  setPhone({ commit }, param) {
    commit("setPhone", param);
  },
  setEmail({ commit }, param) {
    commit("setEmail", param);
  },
};

export const getters = {
  lastName: (state) => {
    return state.lastName;
  },
  firstName: (state) => {
    return state.firstName;
  },
  birthday: (state) => {
    return state.birthday;
  },
  phone: (state) => {
    return state.phone;
  },
  formData: (state) => {
    return {
      lname: state.lastName,
      fname: state.firstName,
      birthday: state.birthday,
      tel: state.phone,
    };
  },
  email: (state) => {
    return state.email;
  },
};
