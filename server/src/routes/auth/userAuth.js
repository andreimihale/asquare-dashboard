import Router from "express";
import {
  loginUser,
  registerUser,
  confirmEmail,
  resendValidationEmail,
  userChangePassword,
  userResetPasswordRequest,
  userResetPassword,
  getProtected,
} from "../../controllers/auth/userAuth";
import authorization from "../../middlewares/cookieMiddleware";

const userAuthRouter = Router();

userAuthRouter.post("/login", loginUser);
userAuthRouter.post("/register", registerUser);
userAuthRouter.get("/activate/:confirmationCode", confirmEmail);
userAuthRouter.post("/resendemail", resendValidationEmail);
userAuthRouter.post("/password/change", authorization, userChangePassword);
userAuthRouter.post("/password/request/reset", userResetPasswordRequest);
userAuthRouter.post("/password/reset/:resetPasswordToken", userResetPassword);
userAuthRouter.get("/protected", authorization, getProtected);
userAuthRouter.get("/logout", authorization, (req, res) => {
  return res
    .clearCookie("access_token")
    .clearCookie("user_id")
    .clearCookie("user_role")
    .status(200)
    .json();
});

export default userAuthRouter;
