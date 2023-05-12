import { ProductManager, ProductModel } from "../dao/index.js";

const productManager = new ProductManager(ProductModel);

export const createProduct = async (req, res) => {
  try {
    const body = req.body;
    body.status = Boolean(body.status);
    body.price = Number(body.price);
    body.stock = Number(body.stock);
    const productAdded = await productManager.addProduct(body);
    res.json({
      status: "success",
      result: productAdded,
      message: "product added",
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
  //  const newProduct = productManager.createProduct();
  //  return newProduct;
};

export const getProducts = async (req, res) => {
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
  //const products = productManager.getProducts();
  //return products;
};

export const getProductById = (prodId) => {
  const prod = productManager.getProductById(prodId);
  return prod;
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.pid;
    const body = req.body;
    body.status = Boolean(body.status);
    body.price = Number(body.price);
    body.stock = Number(body.stock);
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

  const update = productManager.findByIdAndUpdate(id, product, { new: true });
  return update;
};

export const getPaginateProducts = async (query = {}, options = {}) => {
  try {
    const result = await ProductModel.paginate(query, options);
    return result;
  } catch (error) {
    throw new Error(`Error get all ${error}`);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.pid;
    //luego eliminamos el producto
    const productdeleted = await productManager.deleteProduct(productId);
    res.json({ status: "success", result: productdeleted.message });
  } catch (error) {
    res.status(400).json({ message: error });
  }
  //const prodToDelete = productManager.deleteProduct(prodId);
  //return prodToDelete;
};
