import express from "express";
import { engine } from "express-handlebars";
import __dirname from "./utils.js";
import path from "path";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import { authRouter } from "./routes/auth.router.js";
import messagesRouter from "./routes/message.router.js";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { MessageManager } from "../src/dao/index.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { initializedPassport } from "../src/config/passport.config.js";

const app = express();
const messages = [];
const messageManager = new MessageManager();
const connectionString = "";

// Midlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + "/../public"));

// Configuración de la sesión
// app.use(
//   session({
//     store: MongoStore.create({
//       mongoUrl: connectionString,
//     }),
//     secret: "claveSecreta",
//     resave: true,
//     saveUninitialized: true,
//   })
// );

app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

// Configurar PASSPORT
// initializedPassport();
// app.use(passport.initialize());
// app.use(passport.session());

// Routers
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/sessions", authRouter);

mongoose.connect(connectionString).then((conn) => {
  console.log("Connected To DB!");
});

const httpServer = app.listen(8080, () => {
  console.log("Server listening on port 8080");
});

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
  console.log("New client connected!");

  socket.on("message", (data) => {
    socket.emit("input-changed", JSON.stringify(data));
  });

  socket.on("chat-message", async (data) => {
    //messages.push(data);
    console.log("Data: " + data);
    const user = data.user;
    const message = data.message;
    const result = await messageManager.create(user, message);
    socket.emit("messages", result);
  });

  socket.on("new-user", (username) => {
    socket.emit("messages", messages);
    socket.broadcast.emit("new-user", username);
  });

  socket.on("input-changed", (data) => {
    socketServer.emit("input-changed", data);
  });

  socket.on("new-message", (data) => {
    messages.push({ socketId: socket.id, mensaje: data });
    socketServer.emit("input-changed", JSON.stringify(messages));
  });
});
