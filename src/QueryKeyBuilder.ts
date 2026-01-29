import type { ArgsWithOptionalVariables } from "./ArgsWithOptionalVariables";
import type { CreateUnionOfAllQueryKeyStringTemplatePrefixes } from "./CreateUnionOfAllQueryKeyStringTemplatePrefixes";

import { convertQueryKeyStringTemplateToQueryKeyArrayWithVariables } from "./convertQueryKeyStringTemplateToQueryKeyArrayWithVariables";

/**
 * Type safe Query Key builder using strongly typed query key string templates.
 *
 * This supports variables in the query key using the `$myVariable` syntax.
 * If there are variables in the template you will need to include them in the
 * `variables` object optional argument.
 *
 * Example
 * ```typescript
 * export const queryKeyBuilder = new QueryKeyBuilder<
 *   | "podcast.featured.channels"
 *   | "podcast.featured.episodes"
 *   | "podcast.episode.episodeID.$episodeID"
 *   | "podcast.episode.reccomendations.episodeID.$episodeID.$limit"
 * >();
 *
 * // ✅ Works
 * // Since it is a full path without any variables, and the optional object for
 * // variables is not required.
 * queryKeyBuilder.fullPathForDataInsertion("podcast.featured.episodes");
 *
 * // ✅ Works
 * // For partial query keys when it comes to data deletion use cases like
 * // invalidating queries, in this example we want to invalidate all featured
 * // podcast data, regardless of whether it is featured channels or featured
 * // episodes.
 * queryKeyBuilder.partialPathForDataDeletion("podcast.featured");
 *
 * // ❌ TS Error
 * // Missing the variables object for the 'episodeID' variable
 * queryKeyBuilder.fullPathForDataInsertion("podcast.episode.episodeID.$episodeID");
 *
 * // ✅ Works
 * // 'episodeID' variable is passed in
 * queryKeyBuilder.fullPathForDataInsertion(
 *   "podcast.episode.episodeID.$episodeID",
 *   { episodeID: "09sgu9au90aue" },
 * );
 *
 * // ❌ TS Error
 * // Missing 'limit' variable in variables object
 * queryKeyBuilder.fullPathForDataInsertion(
 *   "podcast.episode.reccomendations.episodeID.$episodeID.$limit",
 *   { episodeID: "09sgu9au90aue" },
 * );
 *
 * // ✅ Works
 * // Both variables are passed in
 * queryKeyBuilder.fullPathForDataInsertion(
 *   "podcast.episode.reccomendations.episodeID.$episodeID.$limit",
 *   { episodeID: "09sgu9au90aue", limit: 10 },
 * );
 *
 * // ✅ Works
 * // For partial query keys when it comes to data deletion use cases like
 * // invalidating queries, in this example we want to invalidate all podcast
 * // episode reccomendation queries for the given episodeID, regardless of the
 * // 'limit' variable value.
 * queryKeyBuilder.partialPathForDataDeletion(
 *   "podcast.episode.reccomendations.episodeID.$episodeID",
 *   { episodeID: "09sgu9au90aue" },
 * );
 * ```
 *
 * @internal
 * Both methods have the same runtime implementation, since both are wrappers
 * around the actual logic that does the query key array building. They are only
 * different in the generic type that they accept, allowing either only full
 * query key string templates or partial query key strings.
 */
export class QueryKeyBuilder<
  const AllQueryKeyTemplates extends string,
  const PartialQueryKeyTemplates extends
    CreateUnionOfAllQueryKeyStringTemplatePrefixes<AllQueryKeyTemplates> =
    CreateUnionOfAllQueryKeyStringTemplatePrefixes<AllQueryKeyTemplates>,
> {
  /**
   * Build the full query key using the full query key template when you are
   * doing "data insertion", e.g.
   * - `useQuery`'s `QueryOption`'s `queryKey` property.
   * - `queryClient.setQueryData` method's `queryKey` argument.
   *
   * Since for data insertion you need to be explicit about the full path where
   * this data is cached under.
   */
  fullPathForDataInsertion<const T extends AllQueryKeyTemplates>(
    ...args: ArgsWithOptionalVariables<T>
  ) {
    const [input, variables] = args;
    return convertQueryKeyStringTemplateToQueryKeyArrayWithVariables(
      input,
      variables!,
    );
  }

  /**
   * Build a potentially partial query key using any prefix parts of the query
   * keys when you are doing "data deletion", e.g.
   * - `queryClient.removeQueries` method's `queryKey` argument.
   * - `queryClient.invalidateQueries` method's `queryKey` argument.
   *
   * Since for data deletion you can choose to either delete an explicit full
   * query key path, or delete higher up in the path to delete all data in the
   * child nodes.
   */
  partialPathForDataDeletion<const T extends PartialQueryKeyTemplates>(
    ...args: ArgsWithOptionalVariables<T>
  ) {
    const [input, variables] = args;
    return convertQueryKeyStringTemplateToQueryKeyArrayWithVariables(
      input,
      variables!,
    );
  }
}
