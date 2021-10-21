const Storage = {
  getStorage() {
    return window.localStorage;
  },

  /**
   * @param {String} key
   * @param {String|Number|Array|Object} value
   */
  set(key, value) {
    if (value && typeof value === "object") {
      value = JSON.stringify(value);
    }

    this.getStorage().setItem(key, value);
  },

  /**
   * @param {String} key
   */
  get(key, defaultValue = null) {
    const value = this.getStorage().getItem(key);

    if (value === null) {
      return defaultValue;
    }

    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  },

  remove(key) {
    this.getStorage().removeItem(key);
  },

  /**
   * @param {String} key
   * @param {Object} value
   */
  merge(key, value) {
    if (!value || typeof value !== "object") {
      throw new TypeError("オブジェクト、または配列以外の値は使用できません。");
    }

    const exists = this.get(key);

    if (Array.isArray(value) && Array.isArray(exists)) {
      value = exists.concat(value);
    } else if (exists && typeof exists === "object") {
      if (Array.isArray(value)) {
        throw new TypeError("オブジェクトに配列はマージできません");
      }

      value = Object.assign({}, exists, value);
    }

    this.set(key, value);
  },
};

export default Storage;
