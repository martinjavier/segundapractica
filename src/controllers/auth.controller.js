import { Router } from "express";
import { UserManager, UserModel } from "../dao/index.js";
import passport from "passport";
import alert from "alert";
import jwt from "jsonwebtoken";
import { options } from "../config/options.js";
import { signup } from "../services/auth.service.js";

const authRouter = Router();
const userManager = new UserManager(UserModel);

export const signupController = async (req, res) => {
  const result = signup();
  res.json({ status: "success", data: result });
};
