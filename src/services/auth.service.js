import { UserManager, UserModel } from "../dao/index.js";
import passport from "passport";
import alert from "alert";
import jwt from "jsonwebtoken";
import { options } from "../config/options.js";

const userManager = new UserManager(UserModel);

export const signup = async (req, res) => {
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
};
