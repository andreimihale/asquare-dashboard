import jwt from "jsonwebtoken";
import "dotenv/config";

const signJwt = (user) => {
  const { _id, role, resetPasswordExpires } = user;
  const expiresIn = 60;
  let payload;
  if (role !== "user") {
    payload = {
      userId: _id,
      role,
      resetPasswordExpires,
    };
  } else {
    payload = {
      userId: _id,
      role,
    };
  }

  const signedToken = jwt.sign(payload, process.env.JWT_SECRET);

  return {
    token: `${signedToken}`,
    expires: expiresIn,
  };
};

export default signJwt;
