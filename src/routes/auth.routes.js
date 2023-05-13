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
