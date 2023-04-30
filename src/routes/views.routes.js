import { Router } from "express";
import { CartManager } from "../dao/index.js";
import { ProductManager } from "../dao/index.js";
import { MessageManager } from "../dao/index.js";
import passport from "passport";
import alert from "alert";

const router = Router();

let products = [];

router.get("/", async (req, res) => {
  res.render("login");
});

router.get("/login", async (req, res) => {
  res.render("login");
});

router.get("/signup", async (req, res) => {
  res.render("signup");
});

router.get("/profile", async (req, res) => {
  try {
    res.render("profile");
  } catch (error) {
    alert("Must be authenticated");
    res.redirect("/login");
  }
});

router.get(
  "/products",
  passport.authenticate("authJWT", { session: false }),
  async (req, res) => {
    try {
      let prodManager = new ProductManager();
      let { limit = 10, page = 1, category, stock, sort = "asc" } = req.query;
      const stockValue = stock == 0 ? undefined : parseInt(stock);
      if (!["asc", "desc"].includes(sort)) {
        return res.json({ status: "error", message: "Invalid Order" });
      }
      const sortValue = sort === "asc" ? 1 : -1;
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
      const result = await productManager.getPaginateProducts(query, {
        page,
        limit,
        sort: { price: sortValue },
        lean: true,
      });
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

router.get("/product/:id", async (req, res) => {
  let prodManager = new ProductManager();
  let prodId = req.params.id;
  let product = await prodManager.getOneProd(prodId);
  res.render("oneproduct", { product: product });
});

router.get("/cart/:cid", async (req, res) => {
  let cartManager = new CartManager();
  try {
    let cartId = req.params.cid;
    let carts = await cartManager.getOneCart(cartId);
    res.render("onecart", { cart: carts });
  } catch (error) {
    res.send(`<div>Was an error loading this view</div>`);
  }
});

router.get("/carts", async (req, res) => {
  let prodManager = new ProductManager();
  let products = await prodManager.getProducts();
  let cartManager = new CartManager();
  let carts = await cartManager.getCarts();
  res.render("carts", { carts: carts });
});

router.get("/chat", async (req, res) => {
  let messageManager = new MessageManager();
  let messages = await messageManager.getMessages();
  res.render("chat", { messages: messages });
});

export default router;
