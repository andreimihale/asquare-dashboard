import validator from "validator";
import Admin from "../../models/Admin";
import Cart from "../../models/Cart";
import ProblemError from "../../utils/ProblemError";
import validPassword from "../../utils/validPassword";
import signJwt from "../../utils/signJwt";
import {
  sendOkPasswordResetEmail,
  sendPasswordResetEmailForAdmin,
} from "../../utils/sendConfirmationEmail";
import {
  ONE_DAY,
  THREE_MONTHS,
  validateRegisterBody,
  validatePassword,
} from "./auth.helpers";
import generatePassword from "../../utils/generatePassword";

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
      .status(200)
      .json(publicProfile);
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

export const adminChangePassword = async (req, res, next) => {
  try {
    const {
      userId,
      userRole,
      body: { password },
    } = req;

    const admin = await Admin.findOne({ _id: userId, role: userRole });

    validatePassword(password);

    const saltHash = generatePassword(password);

    admin.salt = saltHash.salt;
    admin.hash = saltHash.hash;
    admin.resetPasswordExpires = new Date(Date.now() + THREE_MONTHS);

    await sendOkPasswordResetEmail(admin.firstName, admin.email);

    await admin.save();

    res.json({
      title: "password-changed",
      description: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const adminResetPasswordRequest = async (req, res, next) => {
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

    const resetPasswordToken = new Date().valueOf();
    admin.resetPasswordToken = resetPasswordToken;

    await sendPasswordResetEmailForAdmin(
      admin.firstName,
      email,
      resetPasswordToken
    );

    await admin.save();

    res.json({
      title: "password-request-sent",
      description: "Password request sent successfully",
      token: admin.resetPasswordToken,
    });
  } catch (error) {
    next(error);
  }
};

export const adminResetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { resetPasswordToken } = req.params;

    const admin = await Admin.findOne({ resetPasswordToken });

    if (!admin) {
      throw new ProblemError(
        400,
        "invalid-confirmation-code",
        "Confirmation Code Invalid",
        "Your confirmation code is invalid for your email address"
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

    validatePassword(password);

    const saltHash = generatePassword(password);

    admin.salt = saltHash.salt;
    admin.hash = saltHash.hash;
    admin.resetPasswordExpires = new Date(Date.now() + THREE_MONTHS);
    admin.resetPasswordToken = null;

    await sendOkPasswordResetEmail(admin.firstName, admin.email);

    await admin.save();

    res.json({
      title: "password-changed",
      description: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};
