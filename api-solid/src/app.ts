import fastify from "fastify";
import { appRoutes } from "./http/routes.js";
import { ZodError } from "zod";
import { env } from "./env";
import fastifyJwt from "@fastify/jwt";

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,  // In a real application, use a secure method to manage secrets 
});

app.register(appRoutes);

app.setErrorHandler((error, _, reply) => {
  if(error instanceof ZodError){
    return reply.status(400).send({ message: "Validation error.", issues: error.format() });
  }

  if(env.NODE_ENV !== "production"){
    console.error(error);
  }else{
    // TODO: Here you can integrate with an external logging service DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: "Internal server error." });
});
