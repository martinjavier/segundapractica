import { Router, json } from "express";
import { ProductManager } from "../dao/index.js";

const productManager = new ProductManager();
const productsRouter = Router();
const productsFileRouter = Router();
productsRouter.use(json());

// Postman GET http://localhost:8080/api/products => Todos los productos
// http://localhost:8080/api/products/?page=5
productsRouter.get("/", async (req, res) => {
  let { page, limit, sort, title, description, stock } = req.query;
  const products = await productManager.getProducts(
    page,
    limit,
    sort,
    title,
    description,
    stock
  );
  res.status(200).send({ status: "Ok", payload: products });
});

// Postman POST
// {"title":"Tercero", "description":"Descripción Tercero", "code":"abc103", "price":300,  "status":true,  "stock":300,  "category":"Tercero",  "thumbnails":[]}
productsRouter.post("/", async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;

  const result = await productManager.create({
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  });

  res.status(201).send({ status: "ok", payload: result });
});

// Postman DELETE http://localhost:8080/api/carts/642660d39cd3ec80e43f50ab
productsRouter.delete("/:id", async (req, res) => {
  const { prodId } = req.params;
  const deleteProd = await productManager.delete(prodId);
  res.send(deleteProd);
});

// Postman GET http://localhost:8080/api/products/64266458ef82d358d9ac3ea4
productsRouter.get("/:id", async (req, res) => {
  const prodId = req.params.id;
  const product = await productManager.getOneProd(prodId);
  //res.status(200).send({ status: "Ok", payload: products });
  res.render("oneproduct", { product: product });
});

/* FILE ROUTER

// Ej http://localhost:8080/products?limit=3 => Primeros tres productos
// Ej http://localhost:8080/products => Todos los productos
productsFileRouter.get("/", async (req, res) => {
  // Recupero los productos
  const products = await manager.getProducts();
  // Obtengo el valor de limit
  let limit = req.query.limit;
  if (!limit) {
    res.send(products);
  } else {
    // Selecciono los N productos
    let selected = [];
    for (let i = 0; i < limit; i++) {
      selected.push(products[i]);
    }
    // Muestro los productos seleccionados
    return res.send(selected);
  }
});


// Ej http://localhost:8080/products/2 => Prod 2
// Ej http://localhost:8080/products/3412 => Error

productsFileRouter.get("/:id", async (req, res) => {
  // Obtengo el valor del elemento
  let id = req.params.id;
  // Recupero el producto
  const product = await manager.getProductById(id);
  // Verifico si existe
  if (product.lenght === 0) {
    res.status(404).send({ message: `There id no product with id ${id}` });
  } else {
    // Muestro el producto seleccionado
    res.send(product);
  }
});


productsFileRouter.post("/", async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;

  let newProd = await manager.create(
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  );
  res.send(newProd);
});

productsFileRouter.post("/:id", async (req, res) => {
  // Obtengo el valor del elemento
  let prodID = req.params.id;
  // Obtengo todos los valores del body
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;
  // Armo los valores actualizados del Producto
  let updatedProd = await manager.updateProduct(
    (id = prodID),
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  );
  res.send(updatedProd);
});

productsFileRouter.delete("/:id", async (req, res) => {
  // Obtengo el valor del elemento
  let prodID = req.params.id;
  // Armo los valores actualizados del Producto
  let deletedProd = await manager.deleteProduct(prodID);
  res.send(deletedProd);
});

*/

export default productsRouter;
