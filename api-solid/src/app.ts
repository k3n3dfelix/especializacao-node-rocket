import fastify from "fastify";
import routes = require("./http/routes");

export const app = fastify();

app.register(routes.appRoutes);
