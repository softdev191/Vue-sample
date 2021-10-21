export const CartCredentialProvider = {
  storage: null,

  init(storage) {
    this.storage = storage;
  },

  get tokenStorageKey() {
    return "cartToken";
  },

  get cartIdStorageKey() {
    return "cartId";
  },

  getToken() {
    const key = this.tokenStorageKey;

    const token = this.storage.get(key);

    return token;
  },

  getCartId() {
    const key = this.cartIdStorageKey;

    const cartId = this.storage.get(key);

    return cartId;
  },

  getCredentials() {
    const cartId = this.getCartId();
    const token = this.getToken();

    return { cartId, token };
  },

  setCredentials(cartId, token) {
    this.storage.set(this.cartIdStorageKey, cartId, {
      path: "/",
    });
    this.cartId = cartId;

    this.storage.set(this.tokenStorageKey, token, {
      path: "/",
    });
    this.token = token;

    return this;
  },

  clear() {
    this.storage.remove(this.cartIdStorageKey, {
      path: "/",
    });
    this.storage.remove(this.tokenStorageKey, {
      path: "/",
    });
  },
};

export default function ({ $cookies }) {
  CartCredentialProvider.init($cookies);
}
