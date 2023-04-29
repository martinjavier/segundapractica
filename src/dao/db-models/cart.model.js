import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const cartsSchema = new mongoose.Schema({
  products: {
    type: [
      {
        products: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: Number,
      },
    ],
    default: [],
  },
});

cartsSchema.plugin(mongoosePaginate);

/*
cartsSchema.pre("findOne", function () {
  this.populate("products.products");
});
*/

const cartModel = mongoose.model("carts", cartsSchema);

export default cartModel;
