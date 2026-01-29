/**
 * Splits a string literal type by a delimiter into a tuple.
 */
export type SplitStringLiteralTypeByDelimiterIntoTuple<
  S extends string,
  D extends string,
> = string extends S
  ? Array<string>
  : S extends ""
    ? []
    : S extends `${infer T}${D}${infer U}`
      ? [T, ...SplitStringLiteralTypeByDelimiterIntoTuple<U, D>]
      : [S];
