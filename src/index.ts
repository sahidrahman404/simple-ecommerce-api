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

    app().listen(3005, () => {
      logger.info("Listening On Port 3005");
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    }
    console.log("Unexpected error", err);
  }
})();
