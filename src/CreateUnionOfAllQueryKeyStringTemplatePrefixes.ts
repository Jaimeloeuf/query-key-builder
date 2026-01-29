/**
 * Recursive type to create a union of string literal types from a single Query
 * Key string template, by splitting up from the period(s) "." e.g. converting
 * ```typescript
 * type BeforeConvert = "podcast.featured.channels"
 * ```
 * into
 * ```typescript
 * type AfterConvert = "podcast" | "podcast.featured" | "podcast.featured.channels"
 * ```
 */
export type CreateUnionOfAllQueryKeyStringTemplatePrefixes<T extends string> =
  T extends `${infer Prefix}.${infer Rest}`
    ?
        | Prefix
        | `${Prefix}.${CreateUnionOfAllQueryKeyStringTemplatePrefixes<Rest>}`
    : T;
