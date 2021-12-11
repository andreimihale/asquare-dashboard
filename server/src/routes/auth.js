import Router from "express";
import {
  getProtected,
  loginUser,
  loginAdmin,
  registerUser,
  registerAdmin,
  confirmEmail,
  resendValidationEmail,
  changePassword,
} from "../controllers/auth";
import authorization from "../middlewares/cookieMiddleware";
import hasRole from "../middlewares/hasRoleMiddleware";

const authRouter = Router();

authRouter.get("/protected", authorization, hasRole("support"), getProtected);
authRouter.post("/login", loginUser);
authRouter.post("/register", registerUser);
authRouter.post("/admin/login", loginAdmin);
authRouter.post("/admin/register", registerAdmin);
authRouter.get("/active/:confirmationCode", confirmEmail);
authRouter.post("/resendemail", resendValidationEmail);
authRouter.post("/password/change", authorization, changePassword);
authRouter.get("/logout", authorization, (req, res) => {
  return res
    .clearCookie("access_token")
    .clearCookie("user_id")
    .clearCookie("user_role")
    .status(200)
    .json();
});

export default authRouter;
