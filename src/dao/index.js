import FileCartManager from "./file-managers/cart.manager.js";
import FileProductManager from "./file-managers/product.manager.js";
import FileMessageManager from "./file-managers/message.manager.js";
import FileUserManager from "./file-managers/user.manager.js";

import FileProductModel from "./file-models/product.model.js";
import FileCartModel from "./file-models/cart.model.js";
import FileMessageModel from "./file-models/message.model.js";

import DbCartManager from "./db-managers/cart.manager.js";
import DbProductManager from "./db-managers/product.manager.js";
import DbMessageManager from "./db-managers/message.manager.js";
import DbUserManager from "./db-managers/user.manager.js";

import DbProductModel from "./db-models/product.model.js";
import DbCartModel from "./db-models/cart.model.js";
import DbMessageModel from "./db-models/message.model.js";

const config = {
  persistenceType: "db",
};

let CartManager,
  ProductManager,
  MessageManager,
  UserManager,
  ProductModel,
  CartModel,
  MessageModel;

if (config.persistenceType === "db") {
  CartManager = DbCartManager;
  ProductManager = DbProductManager;
  MessageManager = DbMessageManager;
  UserManager = DbUserManager;
  ProductModel = DbProductModel;
  CartModel = DbCartModel;
  MessageModel = DbMessageModel;
} else if (config.persistenceType === "file") {
  CartManager = FileCartManager;
  ProductManager = FileProductManager;
  MessageManager = FileMessageManager;
  UserManager = FileUserManager;
  ProductModel = FileProductModel;
  CartModel = FileCartModel;
  MessageModel = FileMessageModel;
} else {
  throw new Error("Unknow persistence type");
}

export {
  CartManager,
  ProductManager,
  MessageManager,
  UserManager,
  ProductModel,
  CartModel,
  MessageModel,
};
