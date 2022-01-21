import mongoose from "mongoose";
import "dotenv/config";
import logger from "../utils/logger";

const devConnection = process.env.DB_STRING;
const prodConnection = process.env.DB_STRING_PROD;

if (process.env.NODE_ENV === "production") {
  mongoose.connect(prodConnection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on("connected", () => {
    logger.info("Database connected");
  });
} else {
  mongoose.connect(devConnection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on("connected", () => {
    logger.info("Database connected");
  });
}
