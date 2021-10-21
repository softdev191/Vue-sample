import https from "https";
import * as logger from "@/utils/log";
import * as httpStatusCode from "@/constants/httpStatusCode";
import { CartCredentialProvider } from "@/plugins/storage-provider/cart-credential";

const shouldRedirectAuthError = (error) => {
  const endpoints = [
    "carts/?.*",
    "guest_purchase/\\d+/confirm",
    "guest_purchase/\\d+/order",
    "purchase/change_payment_type",
    "purchase/confirm",
    "purchase/confirm/amazon_pay",
    { url: "purchase", method: "post" },
  ];
  const baseUrl = "/api/v1";
  const { url } = error.config;

  return endpoints.some((setting) => {
    if (typeof setting === "string") {
      return new RegExp(`^${baseUrl}/${setting}$`).test(url);
    }

    return (
      Object.keys(setting).some((key) =>
        key === "url"
          ? new RegExp(`^${baseUrl}/${setting[key]}$`).test(url) === false
          : error.config[key] !== setting[key]
      ) === false
    );
  });
};

export default function ({ store, $axios, redirect, $cookies, app }) {
  $axios.onRequest((config) => {
    config.httpsAgent = new https.Agent({
      rejectUnauthorized: process.env.NODE_ENV === "production",
    });

    if (!config.isAdmin && store.$auth.loggedIn) {
      const token = store.$auth.getToken("local");
      config.headers.Authorization = token;
    }

    config.headers.Accept = "application/json";
  });

  $axios.onResponse((response) => {
    logger.log("===============================================");
    logger.log(`method: ${response.config.method}`);
    logger.log("url: ", response.config.url);
    logger.log("headers: ", response.config.headers);
    logger.log("params: ", response.config.params);
    logger.log("response.status: ", response.status);
    // console.log("response.data: ", response.data);

    return Promise.resolve(response);
  });

  $axios.onError((error) => {
    if (isAuthHttpError(error) && shouldRedirectAuthError(error)) {
      $cookies.set(
        "lastError",
        {
          message:
            "ログアウトしました。ログインしてからもう一度お試しください。",
        },
        { path: "/" }
      );
      app.$auth.logout();
      app.$amazonPay.logout();
      CartCredentialProvider.clear();
      redirect("/login");
    }

    return Promise.reject(error);
  });
}

export const isHttpError = (error) => {
  return error.response !== null && typeof error.response === "object";
};

export const isAuthHttpError = (error) => {
  return (
    isHttpError(error) &&
    (error.response.status === httpStatusCode.UNAUTHORIZED ||
      error.response.status === httpStatusCode.FORBIDDEN)
  );
};

export const isUnprocessableEntityError = (error) => {
  return (
    isHttpError(error) &&
    error.response.status === httpStatusCode.UNPROCESSABLE_ENTITY
  );
};

export const isNotFoundError = (error) => {
  return (
    isHttpError(error) && error.response.status === httpStatusCode.NOT_FOUND
  );
};
