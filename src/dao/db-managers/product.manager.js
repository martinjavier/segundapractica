class ProductManager {
  constructor(model) {
    this.model = model;
  }

  async addProduct(product) {
    try {
      const data = await this.model.create(product);
      const response = JSON.parse(JSON.stringify(data));
      return response;
    } catch (error) {
      throw new Error(`Error al guardar: ${error}`);
    }
  }

  async getProducts() {
    try {
      const data = await this.model.find();
      const response = JSON.parse(JSON.stringify(data));
      return response;
    } catch (error) {
      throw new Error(`Error get all ${error}`);
    }
  }

  async getPaginateProducts(query = {}, options = {}) {
    try {
      const result = await this.model.paginate(query, options);
      return result;
    } catch (error) {
      throw new Error(`Error get all ${error}`);
    }
  }

  async getProductById(id) {
    try {
      //Comprobación de la estructura y validez del Id de producto recibido por parámetro
      if (id.trim().length != 24) {
        throw new Error("El Id de producto ingresado no es válido");
      }
      const data = await this.model.findById(id);
      if (data) {
        // console.log("data", data)
        const response = JSON.parse(JSON.stringify(data));
        return response;
      }
      throw new Error(`No se encontró el producto`);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateProduct(id, product) {
    try {
      const data = await this.model.findByIdAndUpdate(id, product, {
        new: true,
      });
      const response = JSON.parse(JSON.stringify(data));
      return response;
    } catch (error) {
      throw new Error(`Error al actualizar: no se encontró el id ${id}`);
    }
  }

  async deleteProduct(id) {
    try {
      await this.model.findByIdAndDelete(id);
      return { message: "producto eliminado" };
    } catch (error) {
      throw new Error(`Error al borrar: no se encontró el id ${id}`);
    }
  }
}

export default ProductManager;

/*
import productModel from "../db-models/product.model.js";

export default class ProductManager {
  constructor() {
    //console.log("Working with product using MongoDB");
  }

  // POSTMAN GET http://localhost:8080/api/products
  // http://localhost:8080/api/products?sort=asc&page=2&limit=2
  // http://localhost:8080/api/products?title=Segundo
  // http://localhost:8080/api/products?title=Segundo&description=Descripción Segundo
  // http://localhost:8080/api/products?title=Segundo&description=Descripción Segundo&stock=200
  // http://localhost:8080/api/products?description=Descripción Segundo&stock=200

  getProducts = async (page, limit, sort, title, description, stock) => {
    if (limit === undefined) {
      limit = 10;
    } else {
      limit = limit;
    }
    if (page === undefined) {
      page = 1;
    } else {
      page = page;
    }
    if (sort === "asc") {
      sort = { price: 1 };
    } else if (sort === "desc") {
      sort = { price: -1 };
    } else {
      sort = null;
    }

    let array = {};

    if (title && !description && !stock) {
      array = { title: title };
    } else if (!title && !description && stock) {
      array = { stock: stock };
    } else if (!title && description && !stock) {
      array = { description: description };
    } else if (title && description && !stock) {
      array = { title: title, description: description };
    } else if (title && description && stock) {
      array = { title: title, description: description, stock: stock };
    } else if (title && !description && stock) {
      array = { title: title, stock: stock };
    } else if (!title && description && stock) {
      array = { description: description, stock: stock };
    } else {
      array = {};
    }

    let query = array;

    const products = await productModel.paginate(query, {
      limit: limit,
      lean: true,
      page: page ?? 1,
      sort: sort,
    });

    return products;
  };

  // POSTMAN POST http://localhost:8080/api/products { "title":"Decimo","description":"Descripción Decimo", "code":"abc110","price":1000,"status":true, "stock":1000, "category":"Decimo", "thumbnails":[] }
  create = async (product) => {
    const result = await productModel.create(product);
    return result;
  };

  // POSTMAN DELETE http://localhost:8080/api/products/642c95222f2ec4bf4a7b4930
  delete = async (prodId) => {
    const result = await productModel.deleteOne(prodId);
    return result;
  };

  // POSTMAN GET http://localhost:8080/api/products/64266458ef82d358d9ac3ea4
  getOneProd = async (prodId) => {
    const product = await productModel.findById(prodId);
    return product;
  };
}
*/
