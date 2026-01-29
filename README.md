# query-key-builder
[![NPM version](https://img.shields.io/npm/v/query-key-builder?style=flat-square)](https://npmjs.org/package/query-key-builder)
[![NPM downloads](https://img.shields.io/npm/dm/query-key-builder?style=flat-square)](https://npmjs.org/package/query-key-builder)

> `query-key-builder` is a super simple Type Safe query key builder for TanStack Query libraries like React Query.

This is really simple and has ZERO dependencies, making it super small at just under **400 bytes**!


## What is the problem?
When using TanStack Query libraries like React Query, you can write query keys yourself but they are not type safe and it is easy for you to get them wrong when you update things.

Imagine you started off from this

```typescript
useQuery({
  queryKey: ["episode", episodeID],
  async queryFn() {
    // ... some logic
  },
});


// Similar code to this written in a few files
queryClient.removeQueries({
  queryKey: ["episode"]
})
```

After some time, you realise that you support both podcast episodes and drama episodes, so you want to update the query key to reflect that.

```typescript
useQuery({
  queryKey: ["podcast", "episode", episodeID],
  async queryFn() {
    // ... some logic
  },
});


queryClient.removeQueries({
  queryKey: ["podcast", "episode"]
})
```

But with the above setup, it is troublesome and easy to make mistakes. E.g.
1. You spelled something wrong, instead of "podcast" you wrote "podcasts" in the other query key and making this logic fail
1. You forgot to update some places because there are 10s or 100s of files using this same query key
1. You end up using duplicated query keys and affect some other queries
1. ... and many more!


## What is the solution?
Use a Type Safe query key builder, so that the TypeScript compiler can help prevent mistakes!

You use `$` to denote something as a variable. All variables are fully type safe!

The API is extremely simple too, see the inline JSDoc by hovering over the exported `QueryKeyBuilder` class or by seeing it [here](./src/QueryKeyBuilder.ts).

See the [example code](./example.ts) in your editor for the full warnings, here is the code

```typescript
import { QueryKeyBuilder } from "query-key-builder";

// Put this in a single `queryKeyBuilder.ts` file and import this to use everywhere
export const queryKeyBuilder = new QueryKeyBuilder<
  | "podcast.featured.channels"
  | "podcast.featured.episodes"
  | "podcast.episode.episodeID.$episodeID"
  | "podcast.episode.reccomendations.episodeID.$episodeID.$limit"
>();

// ✅ Works
// Since it is a full path without any variables, and the optional object for
// variables is not required.
queryKeyBuilder.fullPathForDataInsertion("podcast.featured.episodes");

// ✅ Works
// For partial query keys when it comes to data deletion use cases like
// invalidating queries, in this example we want to invalidate all featured
// podcast data, regardless of whether it is featured channels or featured
// episodes.
queryKeyBuilder.partialPathForDataDeletion("podcast.featured");

// ❌ TS Error
// Missing the variables object for the 'episodeID' variable
queryKeyBuilder.fullPathForDataInsertion(
  "podcast.episode.episodeID.$episodeID",
);

// ✅ Works
// 'episodeID' variable is passed in
queryKeyBuilder.fullPathForDataInsertion(
  "podcast.episode.episodeID.$episodeID",
  { episodeID: "09sgu9au90aue" },
);

// ❌ TS Error
// Missing 'limit' variable in variables object
queryKeyBuilder.fullPathForDataInsertion(
  "podcast.episode.reccomendations.episodeID.$episodeID.$limit",
  { episodeID: "09sgu9au90aue" },
);

// ✅ Works
// Both variables are passed in
queryKeyBuilder.fullPathForDataInsertion(
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
```


## License, Author and Contributing
This project is developed by [JJ](https://github.com/Jaimeloeuf) and made available under the [MIT License](./LICENSE). Feel free to use it however you like and open a github issue if you have any questions or problems!