import Router from "express";
import {
  adminChangePassword,
  adminResetPassword,
  adminResetPasswordRequest,
  loginAdmin,
  registerAdmin,
} from "../../controllers/auth/adminAuth";
import authorization from "../../middlewares/cookieMiddleware";

const adminAuthRouter = Router();

adminAuthRouter.post("/login", loginAdmin);
adminAuthRouter.post("/register", registerAdmin);
adminAuthRouter.post("/password/change", authorization, adminChangePassword);
adminAuthRouter.post("/password/request/reset", adminResetPasswordRequest);
adminAuthRouter.post("/password/reset/:resetPasswordToken", adminResetPassword);

export default adminAuthRouter;
