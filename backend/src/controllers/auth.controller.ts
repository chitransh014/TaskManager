import { Request, Response } from "express";
import AuthService from "../services/auth.service";
import { RegisterDto, LoginDto } from "../dtos/auth.dto";
import { cookieOptions } from "../utils/cookie";

export default class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const parsed = RegisterDto.parse(req.body);
      const { user, token } = await AuthService.register(parsed);

      res.cookie("token", token, cookieOptions);

      return res.json({ user, token });
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const parsed = LoginDto.parse(req.body);
      const { user, token } = await AuthService.login(parsed);

      res.cookie("token", token, cookieOptions);

      return res.json({ user, token });
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }

  static async profile(req: Request, res: Response) {
    try {
      const user = await AuthService.getProfile(req.user!.id);
      return res.json({ user });
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const user = await AuthService.updateProfile(req.user!.id, req.body);
      return res.json({ user });
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }

  static async logout(req: Request, res: Response) {
    res.clearCookie("token");
    return res.json({ message: "Logged out" });
  }

  static async getUsers(req: Request, res: Response) {
    try {
      const users = await AuthService.getAllUsers();
      return res.json({ users });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }
}
