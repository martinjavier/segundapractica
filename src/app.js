import express from "express";
import { engine } from "express-handlebars";
import { options } from "./config/options.js";
import { __dirname } from "./utils.js";
import path from "path";
import { productsRouter } from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import viewsRouter from "./routes/views.routes.js";
import authRouter from "./routes/auth.routes.js";
import messageRouter from "./routes/message.routes.js";
import "./config/dbConnection.js";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { MessageManager } from "../src/dao/index.js";
import messageModel from "./dao/db-models/message.model.js";
import passport from "passport";
import { initializedPassport } from "./config/passport.config.js";
import cookieParser from "cookie-parser";

// SERVICE
const messages = [];
const messageManager = new MessageManager(messageModel);

// SERVER
const port = options.server.port;
const app = express();
const httpServer = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// SOCKET SERVER
const socketServer = new Server(httpServer);

// Midlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + "/../public")));
app.use(cookieParser());

httpServer.on("error", (error) => console.log(`Error in server ${error}`));

// Config PASSPORT
initializedPassport();
app.use(passport.initialize());

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

// Routers
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/messages", messageRouter);
app.use("/api/sessions", authRouter);

// SOCKET SERVER CONFIG

socketServer.on("connection", (socket) => {
  console.log(`New client connected! ${socket.id}`);

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

/*
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});
*/

// mongoose.connect(connectionString).then((conn) => {
//   console.log("Connected To DB!");
// });
