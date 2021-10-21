import LRU from "lru-cache";
import { ONE_HOUR, HALF_HOUR, ONE_MINUTE } from "../constants/lruCache";

export default function lruCache() {
  const shortCache = new LRU({ maxAge: ONE_MINUTE });
  const mediumCache = new LRU({ maxAge: HALF_HOUR });
  const longCache = new LRU({ maxAge: ONE_HOUR });
  this.nuxt.hook("vue-renderer:ssr:prepareContext", (ctx) => {
    ctx.$shortLruCache = shortCache;
    ctx.$mediumLruCache = mediumCache;
    ctx.$longLruCache = longCache;
  });
}
