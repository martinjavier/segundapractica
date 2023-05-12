import mongoose from "mongoose";
import { options } from "./options.js";

const mongoDBPass = options.mongoDB.url;

class ConnectionDb {
  static #instance;
  constructor() {
    mongoose.connect(mongoDBPass);
  }
  static async getInstance() {
    if (ConnectionDb.#instance) {
      console.log("Was already connected");
      return ConnectionDb.#instance;
    } else {
      this.#instance = new ConnectionDb();
      console.log("New connection with MongoDB");
      return this.#instance;
    }
  }
}

export { ConnectionDb };

/*
try {
  await mongoose.connect(options.mongoDB.url);
  console.log("Connection to the database was successs");
} catch (error) {
  console.log(`There was an error connecting to the database ${error}`);
}
*/
