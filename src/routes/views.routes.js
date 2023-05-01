import { Router } from "express";
import { CartManager } from "../dao/index.js";
import { ProductManager } from "../dao/index.js";
import { MessageManager } from "../dao/index.js";
import passport from "passport";
import alert from "alert";
import { isUserAuthenticate } from "../middlewares/validations.js";

const viewsRouter = Router();

let products = [];

viewsRouter.get("/", async (req, res) => {
  res.render("login");
});

viewsRouter.get("/login", async (req, res) => {
  res.render("login");
});

viewsRouter.get("/signup", async (req, res) => {
  res.render("signup");
});

viewsRouter.get("/profile", async (req, res) => {
  try {
    console.log(req.user);
    res.render("profile");
  } catch (error) {
    alert("Must be authenticated");
    res.redirect("/login");
  }
});

viewsRouter.get(
  "/products",
  passport.authenticate("authJWT", { session: false }),
  async (req, res) => {
    console.log("Products req.user" + req.user);
    try {
      let { limit = 10, page = 1, category, stock, sort = "asc" } = req.query;
      // console.log("LIMIT: " + limit);
      // console.log("PAGE: " + page);
      // console.log("CATEGORY: " + category);
      // console.log("STOCK: " + stock);
      // console.log("SORT: " + sort);
      const stockValue = stock == 0 ? undefined : parseInt(stock);
      // console.log("stockValue: " + stock);
      if (!["asc", "desc"].includes(sort)) {
        return res.json({ status: "error", message: "Invalid Order" });
      }
      const sortValue = sort === "asc" ? 1 : -1;
      // console.log("sortValue: " + sortValue);
      let query = {};
      if (category && stockValue) {
        query = { category: category, stock: { $gte: stockValue } };
      } else {
        if (category || stockValue) {
          if (category) {
            query = { category: category };
          } else {
            query = { stock: { $gte: stockValue } };
          }
        }
      }
      // console.log("QUERY: " + query);
      const result = await productManager.getPaginateProducts(query, {
        page,
        limit,
        sort: { price: sortValue },
        lean: true,
      });
      console.log("RESULT: " + result);
      const baseUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
      const data = {
        email: req.user.email,
        status: "success",
        payload: result.docs,
        totalDocs: result.totalDocs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage
          ? `${baseUrl.replace(
              `page=${result.page}`,
              `page=${result.prevPage}`
            )}`
          : null,
        nextLink: result.hasNextPage
          ? baseUrl.includes("page")
            ? baseUrl.replace(`page=${result.page}`, `page=${result.nextPage}`)
            : baseUrl.concat(`?page=${result.nextPage}`)
          : null,
      };
      res.render("products", data);

      /*
    let products = await prodManager.getProducts(page, limit);
    res.render("products", {
      products: products,
      user: JSON.stringify(req.session.passport.user),
      name: JSON.stringify(req.user.name),
      email: JSON.stringify(req.user.email),
      role: JSON.stringify(req.user.role).toUpperCase(),
    });
    */
    } catch (error) {
      alert("Must be authenticated");
      res.redirect("/login");
    }
  }
);

viewsRouter.get("/product/:id", async (req, res) => {
  let prodManager = new ProductManager();
  let prodId = req.params.id;
  let product = await prodManager.getOneProd(prodId);
  res.render("oneproduct", { product: product });
});

viewsRouter.get("/cart/:cid", async (req, res) => {
  let cartManager = new CartManager();
  try {
    let cartId = req.params.cid;
    let carts = await cartManager.getOneCart(cartId);
    res.render("onecart", { cart: carts });
  } catch (error) {
    res.send(`<div>Was an error loading this view</div>`);
  }
});

viewsRouter.get("/carts", async (req, res) => {
  let prodManager = new ProductManager();
  let products = await prodManager.getProducts();
  let cartManager = new CartManager();
  let carts = await cartManager.getCarts();
  res.render("carts", { carts: carts });
});

viewsRouter.get("/chat", async (req, res) => {
  let messageManager = new MessageManager();
  let messages = await messageManager.getMessages();
  res.render("chat", { messages: messages });
});

export default viewsRouter;
