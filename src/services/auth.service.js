import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import { signToken } from "../utils/jwt.js";

class AuthService {
  async signup(email, password) {
    const existing = await userModel.findUserByEmail(email);
    if (existing) throw new Error("User already exists");

    const hashed = await bcrypt.hash(password, 10);
    const id = Date.now().toString();
    return await userModel.createUser(id, email, hashed);
  }

  async login(email, password) {
    const user = await userModel.findUserByEmail(email);
    if (!user) throw new Error("User not found");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid password");

    return signToken({ sub: user.id, email: user.email });
  }
}

export default new AuthService();
