import { Router } from "express";
import { createHash } from "../utils.js";
import { isValidPassword } from "../utils.js";
import alert from "alert";
import jwt from "jsonwebtoken";
import { options } from "../config/options.js";
import {
  loginController,
  redirectController,
  signupController,
  failSignup,
  failLogin,
  logoutController,
} from "../controllers/auth.controller.js";

const authRouter = Router();

// Rutas de Autenticación

authRouter.post("/signup", signupController, redirectController);

authRouter.get("/failure-signup", failSignup);

authRouter.post("/login", loginController, redirectController);

authRouter.get("/failure-login", failLogin);

authRouter.get("/logout", logoutController);

authRouter.get("/current", async (req, res) => {
  res.redirect("/current");
});

export default authRouter;

/*
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userManager.getUserByEmail(email);
    if (user) {
      if (isValidPassword(user, password)) {
        const token = jwt.sign(
          {
            _id: user._id,
            first_name: user.first_name,
            email: user.email,
            role: user.role,
          },
          options.server.secretToken,
          { expiresIn: "24h" }
        );
        res
          .cookie(options.server.cookieToken, token, {
            httpOnly: true,
          })
          .redirect("/productos");
      } else {
        alert("Wrong Credentials");
        res.redirect("/login");
      }
    } else {
      alert("User was not registered");
      res.redirect("/signup");
    }
  } catch (error) {
    res.json({ stats: "errorLogin", message: error.message });
  }
});
*/

/*
authRouter.post("/signup", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    const user = await userManager.getUserByEmail(email);
    if (!user) {
      let role = "user";
      if (email.endsWith("@coder.com")) {
        role = "admin";
      }
      const newUser = {
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),
        role,
      };
      const userCreated = await userManager.addUser(newUser);
      const token = jwt.sign(
        {
          _id: userCreated._id,
          first_name: userCreated.first_name,
          email: userCreated.email,
          role: userCreated.role,
        },
        options.server.secretToken,
        { expiresIn: "24h" }
      );
      res
        .cookie(options.server.cookieToken, token, {
          httpOnly: true,
        })
        .redirect("/productos");
    } else {
      alert("User was already registered");
      res.redirect("/login");
    }
  } catch (error) {
    res.json({ stats: "error", message: error.message });
  }
});
*/

/*
authRouter.get("/logout", async (req, res) => {
  req.logout();
  res.clearCookie(options.server.cookieToken).redirect("/login");
});
*/
