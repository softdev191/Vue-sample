export default function ({ $axios }, inject) {
  const api = new API($axios);

  inject("adminApi", api);
}

class API {
  constructor(axios) {
    this.axios = axios;
  }

  fetch(url, token, config = {}) {
    config.isAdmin = true;
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
    config.headers["Admin-Referer"] = window.location.href.replace(
      window.location.search,
      ""
    );

    return this.axios.$get(`/api/v1/admin/${url}`, config);
  }
}
