import Router from "express";
import authRouter from "./auth/index";

const indexRouter = Router();

indexRouter.use("/auth", authRouter);

export default indexRouter;
