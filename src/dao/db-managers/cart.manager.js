class CartManager {
  constructor(model) {
    this.model = model;
  }

  // POSTMAN GET http://localhost:8080/api/carts
  getCarts = async () => {
    const carts = await this.model.find().lean();
    return carts;
  };

  // POSTMAN POST http://localhost:8080/api/carts { "products": [ { "id": "642c517ccbcc6f6acabf0a54", "quantity": 500 } ] }
  create = async (cart) => {
    const result = await this.model.create(cart);
    return result;
  };

  // POSTMAN PUT http://localhost:8080/api/carts/642c94072f2ec4bf4a7b4923/product/642c517ccbcc6f6acabf0a54
  addProduct = async (cartId, productId) => {
    const cart = await this.model.findById(cartId);
    cart.products.push({ productId });
    return cart.save();
  };

  // POSTMAN DELETE http://localhost:8080/api/carts/642660d39cd3ec80e43f50ab
  delete = async (cartId) => {
    const result = await this.model.deleteOne(cartId);
    return result;
  };

  // POSTMAN GET http://localhost:8080/api/carts/642c52b03c49ee17a8574a02
  getOneCart = async (cartId) => {
    const cart = await this.model.findById(cartId);
    return cart;
  };

  // POSTMAN DELETE http://localhost:8080/api/carts/642c52b03c49ee17a8574a02/product/642c93b22f2ec4bf4a7b4920
  deleteProd = async (cartId, prodId) => {
    if (!cartId || !prodId) {
      console.log("falta Información");
    } else {
      let prodDeleted = await this.model.updateOne(
        { _id: cartId },
        { $pull: { products: { _id: prodId } } }
      );
      return prodDeleted;
    }
  };

  // POSTMAN PUT http://localhost:8080/api/carts/6439cdd529f60f6f645409e4/product/64266458ef82d358d9ac3ea4
  updateProductIntoCart = async (cartId, prodId) => {
    try {
      if (!cartId || !prodId) {
        console.log("falta Información");
      } else {
        let prodDeleted = await this.model.updateOne(
          { _id: cartId },
          { $pull: { products: { id: prodId } } }
        );
        const cart = await this.model.findById(cartId);
        cart.products.push({ prodId });
        return cart.save();
      }
    } catch (err) {
      throw new Error(err);
    }
  };
}

export default CartManager;
