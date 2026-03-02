import { QueryKeyBuilder } from "./src/QueryKeyBuilder";

export const queryKeyBuilder = new QueryKeyBuilder<
  | "podcast.featured.channels"
  | "podcast.featured.episodes"
  | "podcast.episode.episodeID.$episodeID"
  | "podcast.episode.reccomendations.episodeID.$episodeID.$limit"
>();

// ✅ Works
// Since it is a full path without any variables, and the optional object for
// variables is not required.
queryKeyBuilder.fullPath("podcast.featured.episodes");

// ✅ Works
// For partial query keys when it comes to data deletion use cases like
// invalidating queries, in this example we want to invalidate all featured
// podcast data, regardless of whether it is featured channels or featured
// episodes.
queryKeyBuilder.partialPathForDataDeletion("podcast.featured");

// ❌ TS Error
// Missing the variables object for the 'episodeID' variable
queryKeyBuilder.fullPath("podcast.episode.episodeID.$episodeID");

// ✅ Works
// 'episodeID' variable is passed in
queryKeyBuilder.fullPath("podcast.episode.episodeID.$episodeID", {
  episodeID: "09sgu9au90aue",
});

// ❌ TS Error
// Missing 'limit' variable in variables object
queryKeyBuilder.fullPath(
  "podcast.episode.reccomendations.episodeID.$episodeID.$limit",
  { episodeID: "09sgu9au90aue" },
);

// ✅ Works
// Both variables are passed in
queryKeyBuilder.fullPath(
  "podcast.episode.reccomendations.episodeID.$episodeID.$limit",
  { episodeID: "09sgu9au90aue", limit: 10 },
);

// ✅ Works
// For partial query keys when it comes to data deletion use cases like
// invalidating queries, in this example we want to invalidate all podcast
// episode reccomendation queries for the given episodeID, regardless of the
// 'limit' variable value.
queryKeyBuilder.partialPathForDataDeletion(
  "podcast.episode.reccomendations.episodeID.$episodeID",
  { episodeID: "09sgu9au90aue" },
);
