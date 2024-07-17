import { User as UserModel } from "@models/users.model.js";

declare global {
  namespace Express {
    interface Request {
      user?: UserModel; // Usa el alias aquí
    }
  }
}