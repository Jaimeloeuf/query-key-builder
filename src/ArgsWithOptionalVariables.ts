import type { ExtractVariablesFromQueryKeyStringTemplate } from "./ExtractVariablesFromQueryKeyStringTemplate";
import type { QueryKeyStringTemplateHasVariables } from "./QueryKeyStringTemplateHasVariables";

/**
 * Determine if the method arguments should include the variables object
 */
export type ArgsWithOptionalVariables<T extends string> =
  QueryKeyStringTemplateHasVariables<T> extends true
    ? [input: T, variables: ExtractVariablesFromQueryKeyStringTemplate<T>]
    : [input: T, variables?: never];
