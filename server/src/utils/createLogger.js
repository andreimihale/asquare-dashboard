import { createLogger, format, transports, addColors } from "winston";

const { combine, timestamp, printf, colorize, splat, label } = format;

const logLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    debug: "blue",
  },
};

const defaultFormat = printf(
  ({
    level: logLevel,
    message: logMessage,
    label: logLabel,
    timestamp: logTimestamp,
  }) => {
    return `${logTimestamp}${
      logLabel ? ` [${logLabel}]` : ""
    } ${logLevel}: ${logMessage}`;
  }
);

addColors(logLevels.colors);

const createLoggerConfig = (level, myLabel, myFormat) => {
  return {
    levels: logLevels.levels,
    format: combine(
      colorize(),
      splat(),
      timestamp(),
      label({ label: myLabel }),
      myFormat
    ),
    transports: [
      new transports.Console({
        level,
      }),
    ],
  };
};

const byEnv = {
  develop: "info",
  qa: "warn",
  production: "error",
};

const defaultLogLevel =
  process.env.LOG_LEVEL || byEnv[process.env.NODE_ENV] || "info";

const logger = (logLevel, logLabel, logFormat) => {
  const loggerConfig = createLoggerConfig(
    logLevel || defaultLogLevel,
    logLabel,
    logFormat || defaultFormat
  );
  const appLogger = createLogger(loggerConfig);

  return appLogger;
};

const defaultLogger = logger(defaultLogLevel);

const withLevel = (level) => logger(level);

export { defaultLogger as logger, logger as createLogger, withLevel };
