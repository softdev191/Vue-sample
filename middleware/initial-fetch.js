export default async function ({ store, route }) {
  if (process.server) {
    const requests = [
      store.dispatch("urgentNotice/fetch", { useCache: true }),
      store.dispatch("master/fetch", { useCache: true }),
    ];

    if (!(route.name || "").match(/^cart-?/)) {
      requests.push(
        store.dispatch("cart/fetch", {
          params: { delete_expired: 0, always_create: 1 },
        })
      );
    }

    await Promise.all(requests);
  }
}
