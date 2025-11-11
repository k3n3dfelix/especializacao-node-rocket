import { app } from "./app.js";
import { env} from "./env";
app
  .listen({
    host: "0.0.0.0",
    port: env.PORT,
  })
  .then(() => {
    console.log("HTTP server running on http://localhost:3333");
  });
