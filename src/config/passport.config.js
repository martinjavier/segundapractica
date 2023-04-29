import passport from "passport";
import LocalStrategy from "passport-local";
import GithubStrategy from "passport-github2";
import { UserModel } from "../dao/db-models/user.model.js";
import { createHash } from "../utils.js";
import { isValidPassword } from "../utils.js";

const initializedPassport = () => {
  passport.use(
    "signupStrategy",
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          const { name } = req.body;
          const user = await UserModel.findOne({ email: username });
          if (user) {
            return done(null, false);
          }
          // Creamos el usuario
          let role = "user";
          if (username.endsWith("@coder.com")) {
            role = "admin";
          }
          // Si no existe el usuario lo registramos
          const newUser = {
            name,
            email: username,
            password: createHash(password),
            role,
          };
          const userCreated = await UserModel.create(newUser);
          return done(null, userCreated);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "loginStrategy",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await UserModel.findOne({ email: username });
          // if user doesn't exists
          if (!user) {
            return done(null, false);
          }
          // verify password
          if (!isValidPassword(user, password)) {
            return done(null, false);
          }
          // If user exists and password is right
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "githubSignup",
    new GithubStrategy(
      {
        clientID: "",
        clientSecret: "",
        callbackURL: "",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const userExists = await UserModel.findOne({ email: profile.email });
          if (userExists) {
            return done(null, false);
          } else {
            const newUser = {
              name: profile._json.name,
              age: null,
              email: profile._json.email,
              password: createHash(profile.id),
            };
            const userCreated = await UserModel.create(newUser);
            return done(null, userCreated);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // SERIALIZAR y DESERIALIZAR USUARIOS
  passport.serializeUser((user, done) => {
    return done(null, user._id); // session {cookie, passport:user.id}
  });

  passport.deserializeUser(async (id, done) => {
    const user = await UserModel.findById(id);
    return done(null, user); // => req.user = user
  });
};

export { initializedPassport };
