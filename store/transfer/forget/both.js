export const state = () => ({
  email: null,
  phone: null,
  memberId: null,
});

export const mutations = {
  setEmail: (state, param) => {
    state.email = param;
  },
  setPhone: (state, param) => {
    state.phone = param;
  },
  setMemberId: (state, param) => {
    state.memberId = param;
  },
};
export const actions = {
  setEmail({ commit }, param) {
    commit("setEmail", param);
  },
  setPhone({ commit }, param) {
    commit("setPhone", param);
  },
  setMemberId({ commit }, param) {
    commit("setMemberId", param);
  },
};

export const getters = {
  email: (state) => {
    return state.email;
  },
  phone: (state) => {
    return state.phone;
  },
  memberId: (state) => {
    return state.memberId;
  },
  formData: (state) => {
    return {
      email: state.email,
      tel: state.phone,
      member_id: state.memberId,
    };
  },
};
