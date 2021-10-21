export const state = () => ({
  email: null,
  birthday: null,
});

export const mutations = {
  setEmail: (state, param) => {
    state.email = param;
  },
  setBirthday: (state, param) => {
    state.birthday = param;
  },
};
export const actions = {
  setEmail: ({ commit }, param) => {
    commit("setEmail", param);
  },
  setBirthday: ({ commit }, param) => {
    commit("setBirthday", param);
  },
};

export const getters = {
  email: (state) => {
    return state.email;
  },
  birthday: (state) => {
    return state.birthday;
  },
  formData: (state) => {
    return {
      email: state.email,
      birthday: state.birthday,
    };
  },
};
