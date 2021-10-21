let limiter = 0;

export const createTree = (data, parentId = null, level = 1) => {
  const tree = [];

  let index = 0;

  while (data.length > 0) {
    limiter++;

    if (limiter > 10000) {
      console.warn("実行回数の上限を超えました");
      break;
    }

    if (data[index] === undefined) {
      if (parentId !== null) {
        break;
      }

      index = 0;
      continue;
    }

    const item = { ...data[index] };

    if (Number(item.parent_id || 0) === Number(parentId || 0)) {
      data.splice(index, 1);

      item.children = createTree(data, item.id, level + 1);

      if (!item.level) {
        item.level = level;
      }

      tree.push(item);

      index = 0;

      continue;
    }

    index++;
  }

  return tree;
};

export const arr2Kv = (srcArray, options = {}) => {
  const { valueName = "value", keyName = "key" } = options;

  return srcArray.reduce(
    (kv, item) => ({
      ...kv,
      [item[keyName]]: item[valueName],
    }),
    {}
  );
};

export const createDict = (items, keyPropName = "id") =>
  items.reduce((dict, item) => {
    return Object.assign(
      dict,
      typeof item === "object"
        ? { [item[keyPropName]]: item }
        : { [item]: item }
    );
  }, {});
