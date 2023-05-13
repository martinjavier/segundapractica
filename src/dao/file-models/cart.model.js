import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema({
  products: {
    type: Array,
    default: [],
  },
});

const FileCartModel = mongoose.model("carts", cartsSchema);

export default FileCartModel;
