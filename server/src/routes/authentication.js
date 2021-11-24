import Router from "express";
import passport from "passport";
import {
  getProtected,
  postLogin,
  postRegister,
} from "../controllers/authentication";

const authRouter = Router();

authRouter.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  getProtected
);
authRouter.post("/login", postLogin);
authRouter.post("/register", postRegister);
export default authRouter;
