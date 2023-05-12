import fs from "fs";
import { __dirname } from "../../utils.js";
import { getNextId } from "./utils.js";

const path = __dirname + "/dao/local-files/products.json";

export default class ProductManager {
  constructor(model) {
    this.model = model;
  }

  getAll = async () => {
    if (fs.existsSync(path)) {
      const data = await fs.promises.readFile(path, "utf-8");
      return JSON.parse(data);
    }
    return [];
  };

  create = async (product) => {
    const products = await this.getAll();

    const newProduct = {
      ...product,
      id: getNextId(products),
    };

    const updatedProducts = [...products, newProduct];

    await fs.promises.writeFile(path, JSON.stringify(updatedProducts));

    return newProduct;
  };
}
