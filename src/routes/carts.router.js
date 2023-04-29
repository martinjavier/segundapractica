import { Router, json } from "express";
import { CartManager } from "../dao/index.js";
import { ProductManager } from "../dao/index.js";

const cartsManager = new CartManager();
const cartsRouter = Router();
const cartsFileRouter = Router();
cartsRouter.use(json());

const productManager = new ProductManager();
const productsRouter = Router();
productsRouter.use(json());

// Postman GET http://localhost:8080/api/carts => Todos los carritos
cartsRouter.get("/", async (req, res) => {
  const cart = await cartsManager.getCarts();
  res.send(cart);
});

// Postman POST http://localhost:8080/api/carts
// { "products": [ { "id": "01202318416858", "quantity": 5 }, {"id": "01202318435129", "quantity": 10}, {"id": "01202318451768", "quantity": 15}] }
cartsRouter.post("/", async (req, res) => {
  const { products } = req.body;
  console.log(products);
  const result = await cartsManager.create({ products });
  res.status(201).send({ status: "ok", payload: result });
});

// Postman DELETE http://localhost:8080/api/carts/642660d39cd3ec80e43f50ab
cartsRouter.delete("/:id", async (req, res) => {
  const { cartId } = req.params;
  const carts = await cartsManager.delete(cartId);
  res.send(carts);
});

// Postman GET http://localhost:8080/api/carts/642c52b03c49ee17a8574a02
cartsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const cart = await cartsManager.getOneCart(id);
  res.send(cart);
});

// Postman DELETE http://localhost:8080/api/carts/642c52b03c49ee17a8574a02/product/64266458ef82d358d9ac3ea4
cartsRouter.delete("/:cId/product/:pId", async (req, res) => {
  const { cId } = req.params;
  const { pId } = req.params;
  const prodToDel = await cartsManager.deleteProd(cId, pId);
  res.send(prodToDel);
});

cartsRouter.put("/:cId/product/:pId", async (req, res) => {
  const { cId } = req.params;
  const { pId } = req.params;
  const prodToUpdate = await cartsManager.updateProductIntoCart(cId, pId);
  res.status(201).send({ status: "ok", payload: prodToUpdate });
});

/* cartsFileRouter

// Ej http://localhost:8080/carts?limit=3 => Primeros tres carritos
// Ej http://localhost:8080/carts => Todos los carritos
cartsFileRouter.get("/", async (req, res) => {
  // Recupero los carritos
  const carts = await cartsManager.getCarts();
  // Obtengo el valor de limit
  let limit = req.query.limit;
  if (!limit) {
    res.send(carts);
  } else {
    // Selecciono los N carritos
    let selected = [];
    for (let i = 0; i < limit; i++) {
      selected.push(carts[i]);
    }
    // Muestro los carritos seleccionados
    return res.send(selected);
  }
});
*/

/*
// Ej http://localhost:8080/carts/2 => Cart 2
// Ej http://localhost:8080/cart/3412 => Error
cartsFileRouter.get("/:id", async (req, res) => {
  // Obtengo el valor del elemento
  let id = req.params.id;
  // Recupero el carrito
  const cart = await cartsManager.getCartById(id);
  // Verifico el carrito
  if (cart.length === 0) {
    res.status(404).send({ message: `There is not a cart with id ${id}` });
  } else {
    res.send(cart);
  }
});
*/

/*
// Postman POST { "products": [ { "id": "01202318416858", "quantity": 5 }, {"id": "01202318435129", "quantity": 10}, {"id": "01202318451768", "quantity": 15}] }
cartsFileRouter.post("/", async (req, res) => {
  const products = req.body.products;
  let newCart = await cartsManager.addCart(products);
  res.send(newCart);
});
*/

/*
// Postman POST http://localhost:8080/api/carts/11202322154781/product/01202318451768
cartsFileRouter.post("/:cid/product/:pid", async (req, res) => {
  // Recupero los valores de params
  const cartID = req.params.cid;
  const prodID = req.params.pid;
  // Recupero los carritos existentes
  const carts = await cartsManager.getCarts();
  // Recupero los productos existentes
  const prods = await productsManager.getProducts();
  // Verifico si existe ese cartito
  let verifyCart = carts.find((c) => c.id === cartID);
  if (verifyCart) {
    // Verifico si existe ese producto
    let verifyProd = prods.find((p) => p.id === prodID);
    if (verifyProd) {
      let localProducts = verifyCart.products;
      let cantidad = Object.keys(localProducts).length;
      for (let i = 0; i < cantidad; i++) {
        if (localProducts[i].id === prodID) {
          localProducts[i].quantity++;
          cartsManager.updateCart(cartID, localProducts);
          return res.send(cartID);
        }
      }
      return res.send(cartID);
    } else {
      return res
        .status(404)
        .send({ message: `There is not a product ID ${prodID}` });
    }
  } else {
    return res
      .status(404)
      .send({ message: `There is not a cart with ID ${cartID}` });
  }
});
*/

/*
// Postman DELETE http://localhost:8080/api/carts/11202322030908
cartsFileRouter.delete("/:cid", async (req, res) => {
  // Recupero los valores de params
  const cartID = req.params.cid;
  let deletedCart = await cartsManager.deleteCart(cartID);
  res.send(deletedCart);
});
*/

/*
// Postman DELETE http://localhost:8080/api/carts/212023215210444/product/01202318416858
cartsFileRouter.delete("/:cid/product/:pid", async (req, res) => {
  // Recupero los valores de params
  const cartID = req.params.cid;
  const prodID = req.params.pid;
  // Recupero los carritos existentes
  const carts = await cartsManager.getCarts();
  // Verifico si existe ese cartito
  let verifyCart = carts.find((c) => c.id === cartID);
  if (verifyCart) {
    // Verifico si existe ese producto en este carrito
    let verifyProd = verifyCart.products.find((p) => p.id === prodID);
    if (verifyProd) {
      let updatedProducts = [];
      let cantidad = Object.keys(verifyProd).length;
      for (let i = 0; i < cantidad; i++) {
        if (verifyCart.products[i].id != prodID) {
          updatedProducts.push(verifyCart.products[i]);
        }
      }
      cartsManager.updateCart(cartID, updatedProducts);
      return res.send(cartID);
    } else {
      return res.status(404).send({
        message: `Into the Cart ${cartID} doesn't exist a product with ID ${prodID}`,
      });
    }
  } else {
    return res
      .status(404)
      .send({ message: `Doesn't exist a Cart with ID ${cartID}` });
  }
});
*/

export default cartsRouter;
