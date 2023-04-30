import { Router } from "express";
import { UserModel } from "../dao/db-models/user.model.js";
import { UserManager } from "../../src/dao/index.js";
import { createHash } from "../utils.js";
import { isValidPassword } from "../utils.js";
import passport from "passport";
import alert from "alert";
import jwt from "jsonwebtoken";
import { options } from "../config/options.js";

const authRouter = Router();
const userManager = new UserManager(UserModel);

// Rutas de Autenticación

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userManager.getUserByEmail(email);
    if (user) {
      if (isValidPassword(password, user)) {
        const token = jwt.sign(
          { first_name: user.first_name, email: user.email, role: user.role },
          options.server.secretToken,
          { expiresIn: "24h" }
        );
        res
          .cookie(options.server.cookieToken, token, {
            httpOnly: true,
          })
          .redirect("/products");
      } else {
        alert("Wrong Credentials");
        res.redirect("/login");
      }
    } else {
      alert("User was not registered");
      res.redirect("/signup");
    }
  } catch (error) {
    res.json({ stats: "error", message: error.message });
  }
});

authRouter.post("/signup", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
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
        password: createHash(password),
        role,
      };
      const userCreated = await userManager.addUser(newUser);
      const token = jwt.sign(
        {
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
        .redirect("/products");
    } else {
      alert("User was already registered");
      res.redirect("/login");
    }
  } catch (error) {
    res.json({ stats: "error", message: error.message });
  }
});

// router.post(
//   "/signup",
//   passport.authenticate("signupStrategy", {
//     failureRedirect: "/api/sessions/failure-signup",
//   }),
//   (req, res) => {
//     res.redirect("/products");
//   }
// );

// router.get("/failure-signup", (req, res) => {
//   res.send(
//     `<div>There was a problem with the signup, try again <a href='/signup'>Signup</a></div>`
//   );
// });

// router.get("/github", passport.authenticate("githubSignup"));

// router.get(
//   "/github-callback",
//   passport.authenticate("githubSignup", {
//     failureRedirect: "/api/sessions/failure-signup",
//   }),
//   (req, res) => {
//     //res.send("Usuario Autenticado");
//     res.redirect("/products");
//   }
// );

// router.post(
//   "/login",
//   passport.authenticate("loginStrategy", {
//     failureRedirect: "/api/sessions/login-failed",
//   }),
//   async (req, res) => {
//     if (!req.user) {
//       return res.status(401).send({ error: "Invalid Credentials" });
//     }
//     req.session.userId = req.user._id;
//     res.redirect("/products");
//   }
// );

// router.get("/login-failed", (req, res) => {
//   //res.send({ error: "Failed login" });
//   alert("Wrong Credentials");
//   res.redirect("/login");
// });

// router.post("/forgot", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await UserModel.findOne({ email: email });
//     if (user) {
//       user.password = createHash(password);
//       const userUpdate = await UserModel.findOneAndUpdate(
//         { email: user.email },
//         user
//       );
//       return res.send("Contraseña Actualizada");
//     } else {
//       return res.send(
//         `Usuario no está registrado <a href="/signup">Signup</a>`
//       );
//     }
//   } catch (error) {
//     return res.send("No se pudo restaurar la contraseña");
//   }
// });

// router.get("/logout", async (req, res) => {
//   req.logout();
//   res.redirect("/login");
// });

export default authRouter;
