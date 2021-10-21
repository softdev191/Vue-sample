export const unique = (arr, key = "id") => {
  const { uniqued } = arr.reduce(
    (dict, element) => {
      const dictKey =
        typeof element === "object" && element !== null
          ? element[key]
          : element;

      dict.duplicated[dictKey] = dict[dictKey] !== undefined;

      if (!dict.duplicated[dictKey]) {
        dict.uniqued.push(element);
      }

      return dict;
    },
    { duplicated: {}, uniqued: [] }
  );

  return uniqued;
};
