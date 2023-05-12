import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  user: {
    type: String,
  },
  message: {
    type: Array,
    default: [],
  },
});

const messageModel = mongoose.model("messages", messageSchema);

export default messageModel;
