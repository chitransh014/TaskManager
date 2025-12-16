import bcrypt from "bcryptjs";
import UserRepository from "../repositories/user.repository";
import { generateToken } from "../utils/jwt";
import { RegisterInput, LoginInput } from "../dtos/auth.dto";

export default class AuthService {
  static async register(data: RegisterInput) {
    const existing = await UserRepository.findByEmail(data.email);
    if (existing) throw new Error("Email already exists");

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await UserRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    const token = generateToken(user.id);

    return { user, token };
  }

  static async login(data: LoginInput) {
    const user = await UserRepository.findByEmail(data.email);
    if (!user) throw new Error("Invalid email or password");

    const match = await bcrypt.compare(data.password, user.password);
    if (!match) throw new Error("Invalid email or password");

    const token = generateToken(user.id);
    return { user, token };
  }

  static async getProfile(userId: string) {
    const user = await UserRepository.findById(userId);
    if (!user) throw new Error("User not found");
    return user;
  }

  static async updateProfile(id: string, data: any) {
    return UserRepository.update(id, data);
  }

  static async getAllUsers() {
    return UserRepository.findAll();
  }
}
