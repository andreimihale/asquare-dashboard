import generatePassword from "../utils/generatePassword";
import signJwt from "../utils/signJwt";
import validPassword from "../utils/validPassword";
import User from "../models/User";
import ProblemError from "../utils/ProblemError";

export const getProtected = async (req, res, next) => {
  try {
    const publicUser = await req.user;

    res.status(200).json({
      success: true,
      user: publicUser,
    });
  } catch (error) {
    next(error);
  }
};

export const postLogin = async (req, res, next) => {
  try {
    const { body } = req;

    const user = await User.findOne({ email: body.email });

    if (!user) {
      throw new ProblemError(
        400,
        "wrong-credentials",
        "Wrong credentials",
        "Invalid email or password"
      );
    }

    if (user.isActive === false) {
      throw new ProblemError(
        400,
        "user-not-active",
        "User not active",
        "User is not activated. Please verify your email to activate it"
      );
    }

    const isValid = validPassword(body.password, user.hash, user.salt);

    if (!isValid) {
      throw new ProblemError(
        400,
        "wrong-credentials",
        "Wrong credentials",
        "Invalid email or password"
      );
    }
    const tokenObject = signJwt(user);

    res.setHeader("token", tokenObject.token);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const postRegister = async (req, res, next) => {
  try {
    const { body } = req;
    const saltHash = generatePassword(body.password);

    const { email } = body;
    const user = await User.findOne({ email });

    if (user) {
      throw new ProblemError(
        400,
        "email-already-exists",
        "Email In Use",
        "Email is already in use"
      );
    }
    email.trim();
    email.toLowerCase();
    const confirmationCode = new Date().valueOf();
    const newUser = new User({
      email,
      hash: saltHash.hash,
      salt: saltHash.salt,
      firstName: body.firstName,
      lastName: body.lastName,
      middleName: body.middleName || null,
      confirmationCode,
      isActive: true,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      title: "account-created",
      detail:
        "Account created successfully! We sent an activation link on email",
    });
  } catch (error) {
    next(error);
  }
};
