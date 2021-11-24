import app from "./app";
import logger from "../utils/logger";
import "dotenv/config";

app.listen(process.env.PORT || 3000, () => {
  logger.info(`Server running on port ${process.env.PORT}`);
});

export default app;
