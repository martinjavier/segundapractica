import { Router } from "express";
import { UserModel } from "../dao/db-models/user.model.js";
import UserManager from "../dao/db-managers/user.manager.js";
import { createHash } from "../utils.js";
import { isValidPassword } from "../utils.js";
import passport from "passport";
import alert from "alert";

const router = Router();
const userManager = new UserManagerMongo(UserModel);

// Rutas de Autenticación
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

export { router as authRouter };
