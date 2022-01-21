import ProblemError from "../utils/ProblemError";

const hasRole = (role) => {
  return (req, res, next) => {
    if (!req.userRole.includes(role)) {
      throw new ProblemError(
        403,
        "permission-denied",
        "Permission Denied",
        "If you need permission for accessing this resource please contact your administrator"
      );
    }

    next();
  };
};

export default hasRole;
