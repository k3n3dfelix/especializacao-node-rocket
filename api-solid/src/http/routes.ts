import type fastify = require("fastify");
import register = require("./register");

export async function appRoutes(app: fastify.FastifyInstance) {
  app.post("/users", register.register);
}