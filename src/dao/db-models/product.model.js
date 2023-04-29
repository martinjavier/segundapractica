import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  code: {
    type: String,
  },
  price: {
    type: Number,
  },
  status: {
    type: String,
  },
  stock: {
    type: Number,
  },
  category: {
    type: String,
  },
  thumbnails: {
    type: Array,
    default: [],
  },
});

productsSchema.plugin(mongoosePaginate);

/*
productsSchema.pre("findOne", function () {
  this.populate("products.products");
});
*/

const productModel = mongoose.model("products", productsSchema);

export default productModel;
