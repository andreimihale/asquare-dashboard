import Router from "express";
import adminAuthRouter from "./adminAuth";
import userAuthRouter from "./userAuth";

const authRouter = Router();

authRouter.use("/user", userAuthRouter);
authRouter.use("/admin", adminAuthRouter);

export default authRouter;
