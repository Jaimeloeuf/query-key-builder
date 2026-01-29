/**
 * Recursive type to extract variable tokens starting with '$' from the query
 * string template.
 */
export type ExtractVariablesFromQueryKeyStringTemplate<T extends string> =
  T extends `${string}$${infer Rest}`
    ? Rest extends `${infer Token}.${infer Next}`
      ? {
          [K in Token]: unknown;
        } & ExtractVariablesFromQueryKeyStringTemplate<`.${Next}`>
      : {
          [K in Rest]: unknown;
        }
    : {};
