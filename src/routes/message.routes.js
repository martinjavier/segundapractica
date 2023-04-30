import { Router, json } from "express";
import { MessageManager } from "../dao/index.js";

const messageManager = new MessageManager();
const messageRouter = Router();
messageRouter.use(json());

// Postman GET http://localhost:8080/api/message => Todos los mensajes
messageRouter.get("/", async (req, res) => {
  const messages = await messageManager.getMessages();
  res.send(messages);
});

// Postman POST http://localhost:8080/api/chat
// { "user": "martin@hotmail.com", "message": "Este es un mensaje de prueba" }
messageRouter.post("/", async (req, res) => {
  const { user, message } = req.body;
  console.log("username: " + user);
  console.log("message: " + message);
  const result = await messageManager.create(user, message);
  res.status(201).send({ status: "ok", payload: { user, message } });
});

export default messageRouter;
