import ProblemError from "../utils/ProblemError";

const supportMiddleware = (req, res, next) => {
  try {
    const role = req.userRole;
    if (role !== "support" && role !== "admin") {
      throw new ProblemError(
        403,
        "unauthorized",
        "Unauthorized Action",
        "You are not authorized to perform this action. Please contact an Admin for this action "
      );
    }
    return next();
  } catch (error) {
    return res.status(403).send(error);
  }
};

export default supportMiddleware;
