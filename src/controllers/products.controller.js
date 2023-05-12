import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/product.service.js";
import { ProductManager, ProductModel } from "../dao/index.js";

export const getProductsController = (req, res) => {
  const result = getProducts();
  res.json({ status: "success", data: result });
};

export const getProductByIdController = (req, res) => {
  const { pid } = req.params;
  const result = getProductById(pid);
  res.json({ status: "success", data: result });
};

export const createProductController = (req, res) => {
  const body = req.body;
  const result = createProduct(body);
  res.json({ status: "success", data: result });
};

export const updateProductController = (req, res) => {
  const productId = req.params.pid;
  const body = req.body;
  const result = updateProduct(productId, body);
  res.json({ status: "success", data: result });
};

export const deleteProductController = (req, res) => {
  const productId = req.params.pid;
  const result = deleteProduct(productId);
  res.json({ status: "success", data: result });
};
