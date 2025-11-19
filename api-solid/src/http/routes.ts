import { FastifyInstance } from "fastify";

import { register } from "../http/controllers/register.js";
import { profile } from "../http/controllers/profile.js";
import { authenticate } from "./controllers/authenticate.js";
import { refresh } from "./controllers/refresh.js";

import { verifyJWT } from "./middlewares/verify-jwt.js";

export async function appRoutes(app: FastifyInstance) {
  app.post("/users", register);

  app.post("/sessions", authenticate);

  app.patch("/token/refresh", refresh);
  
  /**Authenticated */
  app.get("/me", { onRequest: [verifyJWT]}, profile);
}