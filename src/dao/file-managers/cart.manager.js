import fs from "fs";
import { __dirname } from "../../utils.js";
import { getNextId } from "./utils.js";

const path = __dirname + "/dao/local-files/carts.json";

export default class CartManager {
  constructor() {
    console.log("Working with carts using filesystem");
  }

  getAll = async () => {
    if (fs.existsSync(path)) {
      const data = await fs.promises.readFile(path, "utf-8");
      return JSON.parse(data);
    }
    return [];
  };

  create = async (cart) => {
    const carts = await this.getAll();

    const newCart = {
      ...carts,
      id: getNextId(cart),
    };

    const updatedCarts = [...carts, newCart];

    await fs.promises.writeFile(path, JSON.stringify(updatedCarts));

    return newCart;
  };
}
