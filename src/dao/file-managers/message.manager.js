import fs from "fs";
import { __dirname } from "../../utils.js";

const path = __dirname + "/dao/local-files/messages.json";

export default class MessageManager {
  constructor() {
    console.log("Working with message using filesystem");
  }
}
