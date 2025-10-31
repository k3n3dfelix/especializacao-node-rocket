import { expect, it, beforeAll, describe, beforeEach } from "vitest";
import { app } from "../src/app";
import request from "supertest";
import { execSync } from "child_process";

beforeAll(async () => {
  await app.ready();
});

beforeEach(() => {
  execSync("npm run knex migrate:rollback --all");
  execSync("npm run knex migrate:latest");
});

describe("Trsansactions routes", () => {
  it("should be able to create a new transaction", async () => {
    const responseStatusCode = await request(app.server)
      .post("/transactions")
      .send({
        title: "Nova transação",
        amount: 5000,
        type: "credit",
      });
    expect(responseStatusCode.status).toEqual(201);
  });

  it("should be able to list all transactions", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "Nova transação",
        amount: 5000,
        type: "credit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie");

    const listTransactionsResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies)
      .expect(200);

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        title: "Nova transação",
        amount: 5000,
        session_id: expect.any(String),
        created_at: expect.any(String),
      }),
    ]);
  });

  it("should be able to get a specific transactions", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "Nova transação",
        amount: 5000,
        type: "credit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie");

    const listTransactionsResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies)
      .expect(200);

    const transactionId = listTransactionsResponse.body.transactions[0].id;

    const trsnactionalResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set("Cookie", cookies)
      .expect(200);

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: "Nova transação",
        amount: 5000,
      }),
    ]);
  });

  it.todo("should be able to get asummary", async () => {});
});
