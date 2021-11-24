import generatePassword from "../utils/generatePassword";
import signJwt from "../utils/signJwt";
import validPassword from "../utils/validPassword";
import User from "../models/User";
// import ProblemError from "../utils/ProblemError";
import logger from "../utils/logger";
// import passCookieToResponse from "../utils/sanitizeCookies";

export const getProtected = async (req, res, next) => {
  try {
    logger.info("IN GET PROTECTED");
    const publicUser = await req.user;
    logger.info("PUBLIC USER");
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
    logger.info(user);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          title: "wrong-credentials",
          detail: "User or password are wrong",
        },
      });
    }

    if (user.isActive === false) {
      return res.status(401).json({
        success: false,
        error: {
          title: "no-active",
          detail:
            "User is not activated. Please verify your email to activate it",
        },
      });
    }

    const isValid = validPassword(body.password, user.hash, user.salt);
    logger.info("AFTER ISVALID");
    if (isValid) {
      logger.info("IN FIRST IF");

      const tokenObject = signJwt(user);
      logger.info("AFTER SIGN JWT");

      logger.info("BEFORE PASS COOKIE");

      logger.info("AFTER PASS COOKIE");
      res.setHeader("token", tokenObject.token);
      res.status(200).json({
        success: true,
        user,
      });
    } else {
      logger.info("IN ELSE");
      res.status(401).json({
        success: false,
        error: {
          title: "wrong-credentils",
          detail: "User or password are wrong",
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

export const postRegister = async (req, res, next) => {
  try {
    const { body } = req;
    const saltHash = generatePassword(body.password);

    const { email } = body;

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

    try {
      await newUser.save();

      res.status(201).json({
        success: true,
        title: "account-created",
        detail:
          "Account created successfully! We sent an activation link on email",
      });
    } catch (error) {
      res.status(400).json({ success: false, data: { ...error } });
    }
  } catch (error) {
    next(error);
  }
};
