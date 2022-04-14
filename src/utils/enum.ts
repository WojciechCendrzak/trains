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
