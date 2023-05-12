import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    required: true,
    default: [],
  },
});

cartSchema.pre("find", function () {
  this.populate("products.id");
});

// El parámetro "products.id" se refiere a la propiedad "id" del campo "products" del modelo "Cart".
const DbCartModel = mongoose.model(cartCollection, cartSchema);

export default DbCartModel;

//cartsSchema.plugin(mongoosePaginate);

/*
cartsSchema.pre("findOne", function () {
  this.populate("products.products");
});
*/

// const cartModel = mongoose.model("carts", cartsSchema);

// export default cartModel;
