export default function ({ $axios }, inject) {
  const api = new API($axios);

  inject("api", api);
}

class API {
  constructor(axios) {
    this.axios = axios;
  }

  fetch(url, config = {}) {
    return this.axios.$get(`/api/v1/${url}`, config);
  }

  store(url, params, config = {}) {
    return this.axios.$post(`/api/v1/${url}`, params, config);
  }

  update(url, params, config = {}) {
    return this.axios.put(`/api/v1/${url}`, params, config);
  }

  destroy(url, config = {}) {
    return this.axios.delete(`/api/v1/${url}`, config);
  }
}
