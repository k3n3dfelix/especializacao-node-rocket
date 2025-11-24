import { FastifyInstance } from "fastify";

import { register } from "../register.js";
import { profile } from "../profile.js";
import { authenticate } from "../authenticate.js";
import { refresh } from "../refresh.js";

import { verifyJWT } from "../../middlewares/verify-jwt.js";

export async function userRoutes(app: FastifyInstance) {
  app.post("/users", register);

  app.post("/sessions", authenticate);

  app.patch("/token/refresh", refresh);
  
  /** Authenticated */

  app.get("/me", { onRequest: [verifyJWT]}, profile);

  
}