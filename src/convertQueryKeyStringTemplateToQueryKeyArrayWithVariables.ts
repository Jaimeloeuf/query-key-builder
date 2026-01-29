import type { SplitStringLiteralTypeByDelimiterIntoTuple } from "./SplitStringLiteralTypeByDelimiterIntoTuple";

/**
 * Given a Query Key string template and its variable object like
 * ```typescript
 * convertQueryKeyStringTemplateToQueryKeyArrayWithVariables(
 *   "podcast.episode.reccomendations.episodeID.$episodeID.$limit",
 *   { episodeID: "09sgu9au90aue", limit: 10 },
 * );
 * ```
 *
 * this function will convert it into the Query Key array with the variables
 * replaced like
 * ```typescript
 * ["podcast", "episode", "reccomendations", "episodeID", "09sgu9au90aue", 10]
 * ```
 */
export function convertQueryKeyStringTemplateToQueryKeyArrayWithVariables<
  const T extends string,
  const K extends Record<string, unknown>,
>(input: T, variables: K): SplitStringLiteralTypeByDelimiterIntoTuple<T, "."> {
  const queryKeyArray: Array<unknown> = input.split(".");

  if (variables !== undefined) {
    for (const [variableName, variableValue] of Object.entries(variables)) {
      const variableNameWith$Prefix = `$${variableName}`;
      const index = queryKeyArray.findIndex(
        (s) => s === variableNameWith$Prefix,
      );

      // This is a pure runtime safe guard since it should not happen as the
      // types should prevent this from happening.
      if (index === -1) {
        // Logging instead of throwing an error to prevent breaking production
        // eslint-disable-next-line no-console
        console.error(
          `Cannot find variable name in Query Key string template: $${variableName}`,
        );
      } else {
        queryKeyArray[index] = variableValue;
      }
    }
  }

  // Cast to any to take on the complex return type
  return queryKeyArray as any;
}
