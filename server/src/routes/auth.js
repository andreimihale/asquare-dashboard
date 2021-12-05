import Router from "express";
import {
  getProtected,
  postLogin,
  postRegister,
  confirmEmail,
  resendValidationEmail,
} from "../controllers/auth";
import authorization from "../middlewares/cookieMiddleware";

const authRouter = Router();

authRouter.get("/protected", authorization, getProtected);
authRouter.post("/login", postLogin);
authRouter.post("/register", postRegister);
authRouter.get("/logout", authorization, (req, res) => {
  return res.clearCookie("access_token").status(200).json();
});
authRouter.get("/active/:confirmationCode", confirmEmail);
authRouter.post("/resendemail", resendValidationEmail);
export default authRouter;
