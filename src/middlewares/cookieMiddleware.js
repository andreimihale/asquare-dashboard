import jwt from "jsonwebtoken";
import "dotenv/config";
import ProblemError from "../utils/ProblemError";

const authorization = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    throw new ProblemError(403, "no-cookie", "Log in", "Please log in first");
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    if (data.role !== "user") {
      const dateNow = new Date();
      const userDate = new Date(data.resetPasswordExpires);

      if (dateNow > userDate) {
        throw new ProblemError(
          403,
          "password-expire",
          "Your password exipred",
          "Your password have expired. Please change your password"
        );
      }
      req.resetPasswordExpires = userDate;
    }

    req.userId = data.userId;
    req.userRole = data.role;

    return next();
  } catch (error) {
    return res.status(403).send(error);
  }
};

export default authorization;
