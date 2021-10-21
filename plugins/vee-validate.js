import Vue from "vue";
import { ValidationProvider, localize, extend } from "vee-validate";
import ja from "vee-validate/dist/locale/ja.json";
import ValidationObserver from "@/components/atoms/validation/ValidationObserver";

/* eslint-disable camelcase */
import {
  between,
  required,
  confirmed,
  min,
  max,
  min_value,
  max_value,
  digits,
  email,
  alpha_num,
  required_if,
  oneOf,
  numeric,
  regex,
  length,
  excluded,
} from "vee-validate/dist/rules";
/* eslint-enable */

import * as httpStatusCode from "@/constants/httpStatusCode";
import { unique } from "@/utils/array";

export const GLOBAL_ERROR_MESSAGE = "送信に失敗しました。";

const processInvalidInputError = (
  response,
  global,
  withoutDefaultGlobal = false
) => {
  const { errors } = response.data;

  const errorMessages = { ...errors };

  if (withoutDefaultGlobal === false && !errorMessages.global) {
    errorMessages.global = global;
  }

  return errorMessages;
};

/**
 * エラーから、バリデーションメッセージを抽出する
 *
 * @param {AxiosError} error
 * @param {String} defaultMessage
 * @param {Boolean} withoutDefaultGlobal デフォルトのglobalメッセージを付与するかしないか
 *
 * @return {Object}
 */
export const extractValidationError = (
  error,
  defaultMessage = null,
  withoutDefaultGlobal = false
) => {
  const global = [defaultMessage || GLOBAL_ERROR_MESSAGE];

  if (!error.response) {
    return { global };
  }

  const response = error.response;

  switch (response.status) {
    case httpStatusCode.UNPROCESSABLE_ENTITY:
    case httpStatusCode.CONFLICT:
      return processInvalidInputError(response, global, withoutDefaultGlobal);

    default:
      return {
        global: response.data.message || GLOBAL_ERROR_MESSAGE,
      };
  }
};

/**
 * エラーから、バリデーションメッセージを抽出する。オブジェクトからフラットな配列に変換して返す
 *
 * @param {AxiosError} response
 * @param {String} defaultMessage
 * @param {Boolean} withoutDefaultGlobal globalがなかった場合、デフォルトのglobalメッセージを付与するかしないか。
 *                                       フラットな配列で取得する時は、多くの場合不要なのでデフォルトでtrue。
 *
 * @return {Array}
 */
export const extractFlatValidationError = (
  response,
  defaultMessage = null,
  withoutDefaultGlobal = true
) => {
  const errorMessages = extractValidationError(
    response,
    defaultMessage,
    withoutDefaultGlobal
  );

  return unique(
    Object.keys(errorMessages).reduce(
      (messages, key) => messages.concat(errorMessages[key]),
      []
    )
  );
};

// VeeValidateがデフォルトで用意している各ルールを使用するよう指定
extend("between", between);
extend("required_if", required_if);
extend("required", required);
extend("confirmed", confirmed);
extend("email", email);
extend("min", min);
extend("max", max);
extend("min_value", min_value);
extend("max_value", max_value);
extend("digits", digits);
extend("alpha_num", alpha_num);
extend("oneOf", oneOf);
extend("numeric", numeric);
extend("regex", regex);
extend("length", length);
extend("excluded", excluded);
extend("kana", {
  validate(value) {
    // eslint-disable-next-line no-irregular-whitespace
    return /^[ァ-ヶー　]+$/.test(value);
  },
  message: "{_field_}はカタカナで入力してください。",
});
extend("remote", {
  validate(value, { validator }) {
    return validator(value);
  },
  params: ["validator"],
});
extend("password", {
  validate(value) {
    return /^[a-z\d!-/:-@[-`{-~]*$/.test(value);
  },
  message: "{_field_}は英語小文字、記号のみで入力してください。",
});
extend("need_alpha_num", {
  validate(value) {
    return /^[a-z\d!-/:-@[-`{-~]*(?=.?[a-z])(?=.?\d)[!-~]*$/.test(value);
  },
  message:
    "{_field_}は半角小文字アルファベットと半角数字がそれぞれ1つ以上必要です。",
});
Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);
localize("ja", ja);
