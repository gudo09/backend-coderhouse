import "express-serve-static-core";
import { Logger } from "winston";
import { User as UserModel } from "@models/users.model.ts";

declare module "express-serve-static-core" {
  interface Response {
    // respuestas personalizadas para custom.routes
    sendSuccess: (payload: any, message?: string) => this;
    sendUserError: (err: Error) => this;
    sendServerError: (err: Error) => this;
  }

  interface Request {
    user?: UserModel; // Usa el alias aquí
    logger: Logger;
  }
}
