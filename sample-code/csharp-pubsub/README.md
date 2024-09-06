# Pub/Sub Sample Code

This sample shows a brief snippet of a larger file/project that is not yet included included in this repository.  It demonstrates a basic way to post a Pub/Sub message to the [REST API](https://cloud.google.com/pubsub/docs/reference/rest) from an old version of Unity and .NET for which [existing SDKs](https://cloud.google.com/dotnet/docs/reference) are not compatible.

The sample does not run standalone, and relies on a helper function for generating the auth token as well as external JSON libraries for formatting [objects](https://en.wikipedia.org/wiki/Plain_old_CLR_object) as JSON strings