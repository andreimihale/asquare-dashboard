import express from "express";
import yaml from "yamljs";
import { serve, setup } from "swagger-ui-express";
import * as OpenApiValidator from "express-openapi-validator";
import cookieParser from "cookie-parser";
import path from "path";
// import swaggerDocument from "../../swagger/spec.json";
import { version } from "../../package.json";
import errorMiddleware from "../middlewares/errorMiddleware";
import indexRouter from "../routes/index";
import "../services/mongodb";

const publicDir = path.join(path.dirname(__filename), "..", "/views/");
const swaggerDocument = yaml.load(
  path.join(path.dirname(__filename), "/../../swagger/spec.yaml")
);
const app = express();

const IS_NOT_PRODUCTION = process.env.NODE_ENV !== "production";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicDir));

app.use(cookieParser());

if (IS_NOT_PRODUCTION) {
  app.use("/api-docs", serve, setup(swaggerDocument));
}

const openApiRules = {
  apiSpec: swaggerDocument,
  validateRequests: true,
  validateResponses: true,
  ignorePaths: /.*\/(health)$/,
  serDes: [
    OpenApiValidator.serdes.dateTime.deserializer,
    OpenApiValidator.serdes.date.deserializer,
  ],
};

app.use(OpenApiValidator.middleware(openApiRules));

app.use("/health", (req, res) => {
  return res
    .send({
      app: "ok",
      version,
    })
    .status(200);
});

// Add routes to the api's
app.use("/api", indexRouter);

// Add routes to the frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

// Add Error handling
app.use(errorMiddleware);
export default app;
