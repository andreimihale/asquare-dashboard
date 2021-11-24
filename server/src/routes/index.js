import Router from "express";
import authRouter from "./authentication";

const indexRouter = Router();

indexRouter.use("/authenticatication", authRouter);

export default indexRouter;
