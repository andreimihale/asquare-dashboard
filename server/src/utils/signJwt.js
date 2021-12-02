import jwt from "jsonwebtoken";
import "dotenv/config";

const signJwt = (user) => {
  const { _id, role, resetPasswordExpires } = user;
  const expiresIn = 60;

  const payload = {
    userId: _id,
    role,
    resetPasswordExpires,
  };

  const signedToken = jwt.sign(payload, process.env.JWT_SECRET);

  return {
    token: `${signedToken}`,
    expires: expiresIn,
  };
};

export default signJwt;
