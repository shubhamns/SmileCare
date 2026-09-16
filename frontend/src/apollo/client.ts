import { ApolloClient, InMemoryCache } from "@apollo/client";
import { env } from "@/lib/env";
export const client = new ApolloClient({
  uri: env.graphqlUrl,
  cache: new InMemoryCache(),
});
