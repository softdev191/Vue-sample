export const state = () => ({
  lname: "",
  fname: "",
  email: "",
});

export const mutations = {
  setLname: (state, param) => {
    state.lname = param;
  },
  setFname: (state, param) => {
    state.fname = param;
  },
  setEmail: (state, param) => {
    state.email = param;
  },
};
export const actions = {
  setLname: ({ commit }, param) => {
    commit("setLname", param);
  },
  setFname: ({ commit }, param) => {
    commit("setFname", param);
  },
  setEmail: ({ commit }, param) => {
    commit("setEmail", param);
  },
};

export const getters = {
  name: (state) => {
    return `${state.lname} ${state.fname}`;
  },
  email: (state) => {
    return state.email;
  },
  formData: (state) => {
    return {
      email: state.email,
    };
  },
};
