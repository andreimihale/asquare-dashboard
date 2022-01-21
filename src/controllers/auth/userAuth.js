import validator from "validator";
import User from "../../models/User";
import Cart from "../../models/Cart";
import Subscribe from "../../models/Subscribe";
import signJwt from "../../utils/signJwt";
import validPassword from "../../utils/validPassword";
import generatePassword from "../../utils/generatePassword";
import ProblemError from "../../utils/ProblemError";
import {
  sendConfirmationEmail,
  sendOkPasswordResetEmail,
  sendPasswordResetEmail,
} from "../../utils/sendConfirmationEmail";
import {
  ONE_DAY,
  THREE_MONTHS,
  validateRegisterBody,
  validatePassword,
} from "./auth.helpers";

export const getProtected = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.userId });

    if (!user) {
      throw new ProblemError(
        400,
        "user-not-found",
        "User not found",
        "User not found"
      );
    }

    const publicProfile = await user.getPublicProfile();

    res.status(200).json({
      success: true,
      user: publicProfile,
    });
  } catch (error) {
    next(error);
  }
};

export const loadUser = async (req, res, next) => {
  try {
    const {
      userId,
      // eslint-disable-next-line camelcase
      cookies: { access_token },
    } = req;

    const user = await User.findOne({ _id: userId }).select("-hash -salt");

    if (!user) {
      throw new ProblemError(
        400,
        "wrong-credentials",
        "Wrong credentials",
        "Invalid email or password"
      );
    }

    if (user.isActive === "pending") {
      throw new ProblemError(
        400,
        "user-not-active",
        "User not active",
        "User is not activated. Please verify your email to activate it"
      );
    }

    if (user.isActive === "blocked") {
      throw new ProblemError(
        400,
        "user-blocked",
        "User blocked",
        "User has been blocked for violating our T&C"
      );
    }

    res
      .cookie("access_token", access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + ONE_DAY),
      })
      .cookie("user_id", user._id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + ONE_DAY),
      })
      .cookie("user_role", user.role, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + ONE_DAY),
      })
      .status(200)
      .json(user);
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new ProblemError(
        400,
        "wrong-credentials",
        "Wrong credentials",
        "Invalid email or password"
      );
    }

    if (user.isActive === "pending") {
      throw new ProblemError(
        400,
        "user-not-active",
        "User not active",
        "User is not activated. Please verify your email to activate it"
      );
    }

    if (user.isActive === "blocked") {
      throw new ProblemError(
        400,
        "user-blocked",
        "User blocked",
        "User has been blocked for violating our T&C"
      );
    }

    const isValid = validPassword(password, user.hash, user.salt);

    if (!isValid) {
      throw new ProblemError(
        400,
        "wrong-credentials",
        "Wrong credentials",
        "Invalid email or password"
      );
    }

    const dateNow = new Date();
    const userDate = new Date(user.resetPasswordExpires);

    if (dateNow > userDate) {
      throw new ProblemError(
        403,
        "password-expire",
        "Your password exipred",
        "Your password have expired. Please change your password"
      );
    }

    const tokenObject = signJwt(user);

    const publicProfile = await user.getPublicProfile();

    res
      .cookie("access_token", tokenObject.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + ONE_DAY),
      })
      .cookie("user_id", publicProfile._id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + ONE_DAY),
      })
      .cookie("user_role", publicProfile.role, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + ONE_DAY),
      })
      .status(200)
      .json(publicProfile);
  } catch (error) {
    next(error);
  }
};

export const registerUser = async (req, res, next) => {
  try {
    const { body } = req;

    const validateBody = validateRegisterBody(body);

    const { email } = validateBody;

    const user = await User.findOne({ email });

    if (user) {
      throw new ProblemError(
        400,
        "email-already-in-use",
        "Email In Use",
        "Email is already used"
      );
    }

    const saltHash = generatePassword(validateBody.password);

    const activationToken = new Date().valueOf();

    const newUser = new User({
      firstName: validateBody.firstName,
      lastName: validateBody.lastName,
      middleName: validateBody.middleName || null,
      alias: validateBody.alias || null,
      email,
      salt: saltHash.salt,
      hash: saltHash.hash,
      phones: validateBody.phones || [],
      avatar: validateBody.avatar || null,
      isActive: "pending",
      activationToken,
      resetPasswordExpires: new Date(Date.now() + THREE_MONTHS),
    });
    const newCart = new Cart({
      userId: newUser._id,
      products: [],
      price: 0,
      discount: 0,
      totalPrice: 0,
    });
    await sendConfirmationEmail(validateBody.firstName, email, activationToken);

    const subscription = await Subscribe.findOne({ email });

    if (body.subscribe && !subscription) {
      const newSubscribe = new Subscribe({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        userId: newUser._id,
        email: newUser.email,
      });

      await newSubscribe.save();
    }

    await newUser.save();
    await newCart.save();

    res.status(200).json({
      title: "account-created",
      detail:
        "Account created successfully! We sent an activation link on email",
      userData: {
        activationToken: newUser.activationToken,
        email: newUser.email,
        name: newUser.firstName,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const confirmEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({
      activationToken: req.params.confirmationCode,
      isActive: "pending",
    });

    if (!user) {
      throw new ProblemError(
        400,
        "invalid-confirmation-code",
        "Confirmation Code Invalid",
        "Your confirmation code is invalid for your email address"
      );
    }

    user.isActive = "active";
    user.activationToken = null;
    await user.save();
    res.status(200).json();
  } catch (error) {
    next(error);
  }
};

export const resendValidationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    await sendConfirmationEmail(user.firstName, email, user.activationToken);
    res.status(200).json();
  } catch (error) {
    next(error);
  }
};

export const userChangePassword = async (req, res, next) => {
  try {
    const {
      userId,
      userRole,
      body: { password },
    } = req;

    const user = await User.findOne({ _id: userId, role: userRole });

    validatePassword(password);

    const saltHash = generatePassword(password);

    user.salt = saltHash.salt;
    user.hash = saltHash.hash;

    await sendOkPasswordResetEmail(user.firstName, user.email);

    await user.save();

    res.json({
      title: "password-changed",
      description: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const userResetPasswordRequest = async (req, res, next) => {
  try {
    const { email } = req.body;
    email.trim();
    email.toLowerCase();

    if (!validator.isEmail(email)) {
      throw new ProblemError(
        400,
        "invalid-email",
        "Invalid email",
        "Please provide a valid email"
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new ProblemError(
        400,
        "wrong-credentials",
        "Wrong credentials",
        "Invalid email or password"
      );
    }

    if (user.isActive === "pending") {
      throw new ProblemError(
        400,
        "user-not-active",
        "User not active",
        "User is not activated. Please verify your email to activate it"
      );
    }

    if (user.isActive === "blocked") {
      throw new ProblemError(
        400,
        "user-blocked",
        "User blocked",
        "User has been blocked for violating our T&C"
      );
    }

    const resetPasswordToken = new Date().valueOf();
    user.resetPasswordToken = resetPasswordToken;

    await sendPasswordResetEmail(user.firstName, email, resetPasswordToken);

    await user.save();

    res.json({
      title: "password-request-sent",
      description: "Password request sent successfully",
      token: user.resetPasswordToken,
    });
  } catch (error) {
    next(error);
  }
};

export const userResetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { resetPasswordToken } = req.params;

    const user = await User.findOne({ resetPasswordToken });

    if (!user) {
      throw new ProblemError(
        400,
        "invalid-confirmation-code",
        "Confirmation Code Invalid",
        "Your confirmation code is invalid for your email address"
      );
    }

    if (user.isActive === "pending") {
      throw new ProblemError(
        400,
        "user-not-active",
        "User not active",
        "User is not activated. Please verify your email to activate it"
      );
    }

    if (user.isActive === "blocked") {
      throw new ProblemError(
        400,
        "user-blocked",
        "User blocked",
        "User has been blocked for violating our T&C"
      );
    }

    validatePassword(password);

    const saltHash = generatePassword(password);

    user.salt = saltHash.salt;
    user.hash = saltHash.hash;

    user.resetPasswordToken = null;

    await sendOkPasswordResetEmail(user.firstName, user.email);

    await user.save();

    res.json({
      title: "password-changed",
      description: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};
