import { Router } from "express";
import { UserManager, UserModel } from "../dao/index.js";
import passport from "passport";
import alert from "alert";
import jwt from "jsonwebtoken";
import { options } from "../config/options.js";
import { signup, login } from "../services/auth.service.js";
import { isValidPassword, createHash } from "../utils.js";

const authRouter = Router();
const userManager = new UserManager(UserModel);

export const loginController = async (req, res) => {
  const result = login(req, res);
};

export const redirectController = async (req, res) => {
  res.redirect("/products");
};

export const signupController = async (req, res) => {
  const result = signup();
  res.json({ status: "success", data: result });
};

export const failSignup = (req, res) => {
  res.send(
    `<div>Error with the User registration <a href="/signup">Try Again<a></div>`
  );
};

export const failLogin = (req, res) => {
  res.send(`<div>Error with the Login <a href="/login">Try Again<a></div>`);
};

export const logoutController = (req, res) => {
  req.logout();
  res.clearCookie(options.server.cookieToken).redirect("/login");
};
