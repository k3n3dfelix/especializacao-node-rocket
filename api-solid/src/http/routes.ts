import { register } from "../http/controllers/register.js";
import { FastifyInstance } from "fastify";

export async function appRoutes(app: FastifyInstance) {
  app.post("/users", register);
}