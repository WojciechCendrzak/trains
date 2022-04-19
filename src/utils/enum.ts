export const mapEnumToName = (obj: object) =>
  Object.entries(obj)
    .filter(([_, value]) => Number.isInteger(value))
    .reduce(
      (acc, [key, value]) => ({
        ...acc,
        [value]: key,
      }),
      {} as Record<number, string>
    );

// @ts-ignore
export const reverseObject = <Key, Value>(obj: Record<Key, Value>): Record<Value, Key> => {
  const res = Object.entries(obj).reduce(
    (acc, [key, value]: [any, any]) => ({
      ...acc,
      [value]: key,
    }),
    {}
  );

  // @ts-ignore
  return res;
};
