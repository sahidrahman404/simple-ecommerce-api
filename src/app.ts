import express from "express";

export default () => {
  const app = express();

  app.use(express.json());

  return app;
};
