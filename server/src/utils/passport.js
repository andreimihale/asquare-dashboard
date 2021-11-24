import { ExtractJwt, Strategy } from "passport-jwt";
import fs from "fs";
import path from "path";
import User from "../models/User";

const pathToKey = path.join(path.dirname(__filename), "..", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"],
};

const passportStrategy = (passport) => {
  passport.use(
    new Strategy(options, (jwtPayload, done) => {
      const { exp } = jwtPayload;
      if (Date.now() > exp) {
        return done(null, false, {
          success: false,
          error: {
            title: "unauthorized",
            detail: "token have been expired",
          },
        });
      }
      User.findOne({ _id: jwtPayload.sub }, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      });
    })
  );
};

export default passportStrategy;
