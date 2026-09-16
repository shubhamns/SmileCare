import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { createContext } from "./context";
import { config } from "./config";
import { startWorker } from "./queue/worker";
async function main() {
  startWorker();
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  app.use(cors(), express.json(), expressMiddleware(server, { context: async () => createContext() }));
  app.listen(config.port, () => console.log(`GraphQL ready at http://localhost:${config.port}/graphql`));
}
main().catch(console.error);
