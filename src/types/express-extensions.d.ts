import "express-serve-static-core";
import { Logger } from "winston";
import { User as UserModel } from "../models/users.model.ts";

declare module "express-serve-static-core" {
  interface Response {
    // respuestas personalizadas para custom.routes
    sendSuccess: (payload: any, message?: string) => this;
    sendUserError: (err: Error, payload?: any) => this;
    sendServerError: (err: Error, payload?: any) => this;
  }

  interface Request {
    user?: UserModel;
    logger: Logger; 
  }
}
