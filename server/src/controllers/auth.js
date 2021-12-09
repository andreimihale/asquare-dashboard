import validator from "validator";
import generatePassword from "../utils/generatePassword";
import signJwt from "../utils/signJwt";
import validPassword from "../utils/validPassword";
import ProblemError from "../utils/ProblemError";
import sendConfirmationEmail from "../utils/sendConfirmationEmail";
import User from "../models/User";
import Admin from "../models/Admin";
import Cart from "../models/Cart";
import Subscribe from "../models/Subscribe";

const ONE_DAY = 1000 * 60 * 60 * 24;
const THREE_MONTHS = 1000 * 60 * 60 * 24 * 90;

export const getProtected = async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.userId });

    if (!user) {
      user = await Admin.findOne({ _id: req.userId });
      if (!user) {
        throw new ProblemError(
          400,
          "user-not-found",
          "User not found",
          "User not found"
        );
      }
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
      .status(200)
      .json(publicProfile);
  } catch (error) {
    next(error);
  }
};

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      throw new ProblemError(
        400,
        "wrong-credentials",
        "Wrong credentials",
        "Invalid email or password"
      );
    }
    if (admin.isActive === "pending") {
      throw new ProblemError(
        400,
        "user-not-active",
        "User not active",
        "User is not activated. Please verify your email to activate it"
      );
    }

    if (admin.isActive === "blocked") {
      throw new ProblemError(
        400,
        "user-blocked",
        "User blocked",
        "User has been blocked for violating our T&C"
      );
    }
    const isValid = validPassword(password, admin.hash, admin.salt);

    if (!isValid) {
      throw new ProblemError(
        400,
        "wrong-credentials",
        "Wrong credentials",
        "Invalid email or password"
      );
    }

    const tokenObject = signJwt(admin);

    const publicProfile = await admin.getPublicProfile();

    res
      .cookie("access_token", tokenObject.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + ONE_DAY),
      })
      .cookie("user_id", admin._id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + ONE_DAY),
      })
      .cookie("user_role", admin.role, {
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

const validateRegisterBody = (body) => {
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
  return { email, ...body };
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
      phones: validateBody.phone || [],
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

export const registerAdmin = async (req, res, next) => {
  try {
    const { body } = req;

    const validateBody = validateRegisterBody(body);

    const { email } = validateBody;

    const admin = await Admin.findOne({ email });

    if (admin) {
      throw new ProblemError(
        400,
        "email-already-in-use",
        "Email In Use",
        "Email is already used"
      );
    }

    const saltHash = generatePassword(validateBody.password);

    const newAdmin = new Admin({
      firstName: validateBody.firstName,
      lastName: validateBody.lastName,
      middleName: validateBody.middleName || null,
      alias: validateBody.alias || null,
      dateOfBirth: {
        day: validateBody.dateOfBirth.day,
        month: validateBody.dateOfBirth.month,
        year: validateBody.dateOfBirth.year,
      },
      email,
      salt: saltHash.salt,
      hash: saltHash.hash,
      phones: [
        {
          phone: validateBody.phones[0].phone,
          type: validateBody.phones[0].type,
        },
      ],
      role: validateBody.role,
      avatar: validateBody.avatar || null,
      isActive: validateBody.isActive || "active",
      manager: validateBody.manager || null,
      department: validateBody.department,
      resetPasswordExpires: new Date(Date.now() + THREE_MONTHS),
    });

    const newCart = new Cart({
      userId: newAdmin._id,
      products: [],
      price: 0,
      discount: 0,
      totalPrice: 0,
    });

    await newAdmin.save();
    await newCart.save();

    res.status(200).json({
      title: "admin-account-created",
      detail: "Account created successfully!",
      userData: {
        email: newAdmin.email,
        name: newAdmin.firstName,
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
