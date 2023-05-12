import fs from "fs";
import { __dirname } from "../../utils.js";
import { getNextId } from "./utils.js";

const path = __dirname + "/dao/local-files/users.json";

export default class UserManager {
  constructor() {
    console.log("Working with Users using filesystem");
  }

  getAll = async () => {
    if (fs.existsSync(path)) {
      const data = await fs.promises.readFile(path, "utf-8");
      return JSON.parse(data);
    }
    return [];
  };

  create = async (user) => {
    const users = await this.getAll();

    const newUser = {
      ...user,
      id: getNextId(users),
    };

    const updatedUsers = [...users, newUser];

    await fs.promises.writeFile(path, JSON.stringify(updatedUsers));

    return newUser;
  };
}
