import validator from "validator";
import ProblemError from "../../utils/ProblemError";

export const ONE_DAY = 1000 * 60 * 60 * 24;

export const THREE_MONTHS = 1000 * 60 * 60 * 24 * 90;

export const validatePassword = (password) => {
  if (!validator.isStrongPassword(password)) {
    throw new ProblemError(
      400,
      "weak-password",
      "Weak password",
      "Please provide a stronger password"
    );
  }
};

export const validateRegisterBody = (body) => {
  const { email } = body;
  email.trim();
  email.toLowerCase();

  if (
    validator.isEmpty(email) ||
    validator.isEmpty(body.password) ||
    validator.isEmpty(body.firstName) ||
    validator.isEmpty(body.lastName)
  ) {
    throw new ProblemError(
      400,
      "empty-fields",
      "Empty fields",
      "Please fill all the fields"
    );
  }
  if (!validator.isEmail(email)) {
    throw new ProblemError(
      400,
      "invalid-email",
      "Invalid email",
      "Please provide a valid email"
    );
  }

  validatePassword(body.password);

  return { ...body, email };
};
