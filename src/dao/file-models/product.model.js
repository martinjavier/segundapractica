import mongoose from "mongoose";

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

const FileProductModel = mongoose.model("products", productsSchema);

export default FileProductModel;
