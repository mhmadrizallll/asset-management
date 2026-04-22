import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../config/db";

const SECRET = process.env.JWT_SECRET;

export const AuthService = {
  async register(payload: any) {
    const hashed = await bcrypt.hash(payload.password, 10);

    const [user] = await db("users")
      .insert({
        name: payload.name,
        email: payload.email,
        password: hashed,
      })
      .returning("*");

    return user;
  },

  async login(payload: any) {
    const user = await db("users").where("email", payload.email).first();

    if (!user) throw new Error("User not found");

    const match = await bcrypt.compare(payload.password, user.password);
    if (!match) throw new Error("Wrong password");

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET ?? "", {
      expiresIn: "1d",
    });

    return { user, token };
  },
};
