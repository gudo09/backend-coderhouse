import "express-serve-static-core";
import { User as UserModel } from "@models/users.model.ts";

declare module "express-serve-static-core" {
  interface Response {
    // respuestas personalizadas para custom.routes
    sendSuccess: (payload: any) => this;
    sendUserError: (err: Error) => this;
    sendServerError: (err: Error) => this;
  }

  interface Request {
    user?: UserModel; // Usa el alias aquí
  }
}
