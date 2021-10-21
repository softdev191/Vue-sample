import { isEmptyNumber } from "@/utils/number";

export const formEmptyNumber = (value) => (isEmptyNumber(value) ? null : value);

export const formatNumber = (value) =>
  isEmptyNumber(value) ? "0" : new Intl.NumberFormat().format(value);

export const yen = (value) => `${formatNumber(value)}円`;

export const fillNumber = (value, length, filling = "0") =>
  ([...new Array(length)].map(() => filling).join("") + String(value)).slice(
    -length
  );
