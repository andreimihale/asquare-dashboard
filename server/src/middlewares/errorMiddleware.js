import { v4 as uuidv4 } from "uuid";
import { HttpError } from "express-openapi-validator/dist/framework/types";
import logger from "../utils/logger";
import ProblemError from "../utils/ProblemError";
import { PROBLEM_TYPES, PROBLEM_DESCRIPTION } from "../utils/problems";

export default (err, _req, res, next) => {
  try {
    const instance = uuidv4();
    const status = err.status || 500;
    let type = err.type || "unexpected-error";
    let title = err.title || "Unexpected Error";
    let detail =
      err.detail || "Unexpected Error: Something unexpected happened";

    if (err instanceof ProblemError) {
      type = err.type || "Received unknown errorKey";
      title = err.title || "Received unknown errorCode";
      detail =
        err.detail || "Received unknown errorMessage and errorParamaters";
    }

    if (err instanceof HttpError) {
      type = PROBLEM_TYPES.SWAGGER_ERROR;
      title = PROBLEM_DESCRIPTION[PROBLEM_TYPES.SWAGGER_ERROR];
      detail = `Request${err.errors[0].path} ${err.errors[0].message}`;
    }

    logger.log(
      "error",
      `status: ${status} type: urn:problem-type:${type} title: ${title} detail: ${detail} instance: urn:uuid:${instance}`
    );

    res.status(status).json({
      status,
      type: `urn:problem-type:${type}`,
      title,
      detail,
      instance: `urn:uuid:${instance}`,
    });
  } catch (ex) {
    next(ex);
  }
};
