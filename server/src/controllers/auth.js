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

    res
      .cookie("access_token", tokenObject.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 60 * 1000),
      })
      .status(200)
      .json({ success: true, user });
    // res.setHeader("token", tokenObject.token);
    // res.status(200).json({
    //   success: true,
    //   user,
    // });
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
      phones: [body.phone] || [],
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

    if (body.subscribe) {
      const newSubscribe = new Subscribe({
        userId: newUser._id,
        email: newUser.email,
      });
      await newSubscribe.save();
    }

    res.status(201).json({
      success: true,
      title: "account-created",
      detail:
        "Account created successfully! We sent an activation link on email",
      data: {
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
    user.ativationToken = null;
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
