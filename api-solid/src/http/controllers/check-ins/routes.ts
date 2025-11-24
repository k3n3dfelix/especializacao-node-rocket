import { FastifyInstance } from "fastify";

import { verifyJWT } from "../../middlewares/verify-jwt.js";
import { create } from "./create.js";
import { metrics } from "./metrics.js";
import { history } from "./history.js";
import { verifyUserRole } from "@/http/middlewares/only-admin.js";
import { validate } from "./validate.js";

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.post("/gyms/:gymId/check-ins", create);
  app.get("/check-ins/history", history);
  app.get("/check-ins/metrics", metrics);
   app.patch(
    '/check-ins/:checkInId/validate',
    { onRequest: [verifyUserRole('ADMIN')] },
    validate,
  )
}
