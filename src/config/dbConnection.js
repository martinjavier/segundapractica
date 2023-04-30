import mongoose from "mongoose";
import { options } from "./options.js";

try {
  await mongoose.connect(options.mongoDB.url);
  console.log("Connection to the database was successs");
} catch (error) {
  console.log(`There was an error connecting to the database ${error}`);
}
