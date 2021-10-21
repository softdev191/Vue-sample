import { v4 as uuidv4 } from "uuid";
import storage from "@/storage/local";
import { REDISPLAY_REQUEST_TOKEN_KEY } from "@/constants/storage";

const RedisplayRequestTokenProvider = {
  token: null,
  getToken() {
    if (!this.token) {
      this.token = storage.get(REDISPLAY_REQUEST_TOKEN_KEY);
    }

    if (!this.token) {
      this.token = uuidv4();
      storage.set(REDISPLAY_REQUEST_TOKEN_KEY, this.token);
    }

    return this.token;
  },
};

export default RedisplayRequestTokenProvider;
