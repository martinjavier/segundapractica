import { Router } from "express";
import { ProductManager } from "../dao/index.js";
//importamos el modelo de productos
import ProductModel from "../dao/db-models/product.model.js";
import { checkValidProductFields } from "../middlewares/validations.js";

//services
// const productManager = new ProductManagerFile('products.json');
const productManager = new ProductManager(ProductModel);

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, category, stock, sort = "asc" } = req.query;
    const stockValue = stock == 0 ? undefined : parseInt(stock);
    if (!["asc", "desc"].includes(sort)) {
      return res.json({ status: "error", mesage: "orden no valido" });
    }
    const sortValue = sort === "asc" ? 1 : -1;
    // console.log('limit: ', limit, "page: ", page,"category: ", category, "stockValue: ", stockValue, "sortValue: ", sortValue);
    let query = {};
    if (category && stockValue) {
      query = { category: category, stock: { $gte: stockValue } };
    } else {
      if (category || stockValue) {
        if (category) {
          query = { category: category };
        } else {
          query = { stock: { $gte: stockValue } };
        }
      }
    }
    // console.log("query: ", query);
    const result = await productManager.getPaginateProducts(query, {
      page,
      limit,
      sort: { price: sortValue },
      lean: true,
    });
    // console.log("result: ", result);
    const baseUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
    res.json({
      status: "success",
      payload: result.docs,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `${baseUrl}?page=${result.prevPage}`
        : null,
      nextLink: result.hasPrevPage
        ? `${baseUrl}?page=${result.prevPage}`
        : null,
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
    // console.log("product: ", product);
    res.status(200).json({ status: "success", result: product });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//ruta para agregar un producto
router.post("/", checkValidProductFields, async (req, res) => {
  try {
    const body = req.body;
    body.status = Boolean(body.status);
    body.price = Number(body.price);
    body.stock = Number(body.stock);
    // console.log("body: ", body);
    const productAdded = await productManager.addProduct(body);
    res.json({
      status: "success",
      result: productAdded,
      message: "product added",
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

//ruta para actualizar un producto
router.put("/:pid", checkValidProductFields, async (req, res) => {
  try {
    const productId = req.params.pid;
    const body = req.body;
    body.status = Boolean(body.status);
    body.price = Number(body.price);
    body.stock = Number(body.stock);
    // console.log("body: ", body);
    //actualizamos el método, pasándole el id y el body
    const productUpdated = await productManager.updateProduct(productId, body);
    res.json({
      status: "success",
      result: productUpdated,
      message: "product updated",
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

//ruta para eliminar el producto
router.delete("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    //luego eliminamos el producto
    const productdeleted = await productManager.deleteProduct(productId);
    res.json({ status: "success", result: productdeleted.message });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

export { router as productsRouter };

/*
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

export default productsRouter;
*/
