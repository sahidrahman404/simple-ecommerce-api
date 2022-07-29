import app from "./app";
import pool from "./utils/pool";
import config from "config";
import logger from "./utils/logger";

(async () => {
  try {
    await pool.connect({
      host: config.get("host"),
      port: config.get("port"),
      database: config.get("database"),
      user: config.get("user"),
      password: config.get("password"),
    });

    return app().listen(config.get("listeningPort"), () => {
      logger.info(`Listening On Port ${config.get("listeningPort")}`);
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    }
    console.log("Unexpected error", err);
  }
})();
