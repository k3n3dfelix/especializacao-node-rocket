import fastify from "fastify";
import crypto from "node:crypto";
import { knex } from "./database";
import { env } from "./env";
import cookie from "@fastify/cookie";

import { transactionRoutes } from "./routes/transactions";

export const app = fastify();

// app.get("/hello", async () => {
//   const tables = await knex("sqlite_schema").select("*");

//   //INSERT
//   // const transaction = await knex('transactions').insert({
//   //     id: crypto.randomUUID(),
//   //     title: 'New transaction',
//   //     amount: 5000
//   // })

//   //BUSCA
//   const transaction = await knex("transactions").select("*").returning("*");
//   return transaction;
// });

app.register(cookie);
app.register(transactionRoutes, { prefix: "/transactions" });