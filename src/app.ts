import express from "express";
import deSerializeUser from "./middleware/deserializeUser";
import routes from "./routes";

export default () => {
  const app = express();

  app.use(deSerializeUser);
  app.use(express.json());
  app.use(routes);

  return app;
};
