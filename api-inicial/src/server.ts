import { knex } from "./database";
import fastify from "fastify";

const app = fastify();

app.get("/hello", async () => {
  const tables = await knex("sqlite_schema").select("*");
  return tables;
});

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("Http Server Running!");
  });
