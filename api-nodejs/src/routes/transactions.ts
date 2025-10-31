import type fastify = require("fastify");
import { knex } from "../database";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

export async function transactionRoutes(app: fastify.FastifyInstance) {
  //Listagem -----------------------------------------------------------------
  app.get(
    "/",
    { preHandler: [checkSessionIdExists] },
    async (request, response) => {
      const sessionId = request.cookies.sessionId;

      const transactions = await knex("transactions")
        .where("session_id", sessionId)
        .select("*");
      return { transactions };
    }
  );

  //Listagem Unica -----------------------------------------------------------
  app.get("/:id", { preHandler: [checkSessionIdExists] }, async (request) => {
    const sessionId = request.cookies.sessionId;
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    });
    const { id } = getTransactionParamsSchema.parse(request.params);

    const transaction = await knex("transactions")
      .where("id", id)
      .andWhere("session_id", sessionId)
      .first();
    return { transaction };
  });

  //Resumo --------------------------------------------------------------------
  app.get(
    "/summary",
    { preHandler: [checkSessionIdExists] },
    async (request) => {
      const sessionId = request.cookies.sessionId;
      const summary = await knex("transactions")
        .where("session_id", sessionId)
        .sum("amount", { as: "amount" })
        .first();

        
      return { summary };
    }
  );

  //Criacao -------------------------------------------------------------------
  app.post(
    "/",
    async (request, response) => {
      //const tables = await knex("sqlite_schema").select("*");
      //INSERT
      // const transaction = await knex('transactions').insert({
      //     id: crypto.randomUUID(),
      //     title: 'New transaction',
      //     amount: 5000
      // })
      //BUSCA
      // const transaction = await knex("transactions").select("*").returning("*");
      // return transaction;

      const createTransactionBodySchema = z.object({
        title: z.string(),
        amount: z.number(),
        type: z.enum(["credit", "debit"]),
      });
      const { amount, title, type } = createTransactionBodySchema.parse(
        request.body
      );

      let sessionId = request.cookies.sessionId;

      if (!sessionId) {
        sessionId = randomUUID();
        response.cookie("sessionId", sessionId, {
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        }); //7 dias
      }

      await knex("transactions").insert({
        id: crypto.randomUUID(),
        title,
        amount: type === "credit" ? amount : amount * -1,
        session_id: sessionId,
      });

      return response.status(201).send();
    }
  );
}
