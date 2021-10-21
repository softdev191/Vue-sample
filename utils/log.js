export const emit = (level, ...message) => {
  if (process.env.NODE_ENV !== "production") {
    console[level](...message);
  }
};

export const debug = (...message) => emit("debug", ...message);
export const log = (...message) => emit("log", ...message);
export const error = (...message) => emit("error", ...message);
