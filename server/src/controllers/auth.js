import validator from "validator";
import generatePassword from "../utils/generatePassword";
import signJwt from "../utils/signJwt";
import validPassword from "../utils/validPassword";
import User from "../models/User";
import ProblemError from "../utils/ProblemError";
import sendConfirmationEmail from "../utils/sendConfirmationEmail";
import Cart from "../models/Cart";
import Subscribe from "../models/Subscribe";

export const getProtected = async (req, res, next) => {
  try {
    const publicUser = await req.user;
    const publicProfile = await publicUser.getPublicProfile();
    res.status(200).json({
      success: true,
      user: publicProfile,
    });
  } catch (error) {
    next(error);
  }
};

export const postLogin = async (req, res, next) => {
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
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })
      .status(200)
      .json(publicProfile);
  } catch (error) {
    next(error);
  }
};

export const postRegister = async (req, res, next) => {
  try {
    const { body } = req;
    const threeMonthsDate = 1000 * 60 * 60 * 24 * 90;
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

    if (!validator.isStrongPassword(body.password)) {
      throw new ProblemError(
        400,
        "weak-password",
        "Weak password",
        "Please provide a stronger password"
      );
    }

    const user = await User.findOne({ email });
    if (user) {
      throw new ProblemError(
        400,
        "email-already-in-use",
        "Email In Use",
        "Email is already used"
      );
    }

    const saltHash = generatePassword(body.password);

    const activationToken = new Date().valueOf();
    const newUser = new User({
      firstName: body.firstName,
      lastName: body.lastName,
      middleName: body.middleName || null,
      alias: body.alias || null,
      email,
      salt: saltHash.salt,
      hash: saltHash.hash,
      phones: body.phone || [],
      avatar: body.avatar || null,
      isActive: "pending",
      activationToken,
      resetPasswordExpires: new Date(Date.now() + threeMonthsDate),
    });
    const newCart = new Cart({
      userId: newUser._id,
      products: [],
      price: 0,
      discount: 0,
    });
    await sendConfirmationEmail(body.firstName, email, activationToken);
    await newUser.save();
    await newCart.save();
    const subscription = Subscribe.findOne({ email });
    if (body.subscribe && !subscription) {
      const newSubscribe = new Subscribe({
        userId: newUser._id,
        email: newUser.email,
      });
      await newSubscribe.save();
    }

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
    const { name, email, activationToken } = req.body;
    await sendConfirmationEmail(name, email, activationToken);
    res.status(200).json();
  } catch (error) {
    next(error);
  }
};
