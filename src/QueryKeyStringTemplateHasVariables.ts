/**
 * Type to check if any $ variable tokens exist in the given Query Key string
 * template.
 */
export type QueryKeyStringTemplateHasVariables<T extends string> =
  T extends `${string}$${string}` ? true : false;
