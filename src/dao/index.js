import FileCartManager from "./file-managers/cart.manager.js";
import FileProductManager from "./file-managers/product.manager.js";
import FileMessageManager from "./file-managers/message.manager.js";
import FileUserManager from "./file-managers/user.manager.js";

import DbCartManager from "./db-managers/cart.manager.js";
import DbProductManager from "./db-managers/product.manager.js";
import DbMessageManager from "./db-managers/message.manager.js";
import DbUserManager from "./db-managers/user.manager.js";

const config = {
  persistenceType: "db",
};

let CartManager, ProductManager, MessageManager, UserManager;

if (config.persistenceType === "db") {
  CartManager = DbCartManager;
  ProductManager = DbProductManager;
  MessageManager = DbMessageManager;
  UserManager = DbUserManager;
} else if (config.persistenceType === "file") {
  CartManager = FileCartManager;
  ProductManager = FileProductManager;
  MessageManager = FileMessageManager;
  UserManager = FileUserManager;
} else {
  throw new Error("Unknow persistence type");
}

export { CartManager, ProductManager, MessageManager, UserManager };
