import { UserModel } from "../db-models/user.model.js";

export default class UserManager {
  constructor() {
    console.log("Working with Users using MongoDB");
  }

  // POSTMAN GET http://localhost:8080/api/users
  getUsers = async () => {
    const users = await userModel.find().lean();
    return users;
  };

  // POSTMAN POST http://localhost:8080/api/users { "products": [ { "id": "642c517ccbcc6f6acabf0a54", "quantity": 500 } ] }
  createUser = async (user) => {
    const result = await userModel.create(user);
    return result;
  };

  // POSTMAN PUT http://localhost:8080/api/users/642c94072f2ec4bf4a7b4923/product/642c517ccbcc6f6acabf0a54
  addUser = async (userId, name, email, password, role) => {
    const user = await userModel.findById(userId);
    user.push({ user });
    return user.save();
  };

  // POSTMAN DELETE http://localhost:8080/api/carts/642660d39cd3ec80e43f50ab
  deleteOneUser = async (userId) => {
    const result = await userModel.deleteOne(userId);
    return result;
  };

  // POSTMAN GET http://localhost:8080/api/carts/642c52b03c49ee17a8574a02
  getOneUser = async (userId) => {
    const user = await userModel.findById(userId);
    return user;
  };
}
