export default function ({ ssrContext }, inject) {
  if (process.server) {
    const lru = new LRU(
      ssrContext.$shortLruCache,
      ssrContext.$mediumLruCache,
      ssrContext.$longLruCache
    );
    inject("lru", lru);
  }
}

class LRU {
  constructor(short, medium, long) {
    this.short = short;
    this.medium = medium;
    this.long = long;
  }

  getShortCache(key) {
    return this.short.get(key);
  }

  setShortCache(key, value) {
    this.short.set(key, value);
    return true;
  }

  getMediumCache(key) {
    return this.medium.get(key);
  }

  setMediumCache(key, value) {
    this.medium.set(key, value);
    return true;
  }

  getLongCache(key) {
    return this.long.get(key);
  }

  setLongCache(key, value) {
    this.long.set(key, value);
    return true;
  }
}
