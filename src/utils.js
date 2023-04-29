import { fileURLToPath } from "url";
import { dirname } from "path";
import * as url from "url";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;

export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync());
};

export const isValidPassword = (user, loginPassword) => {
  return bcrypt.compareSync(loginPassword, user.password);
};
