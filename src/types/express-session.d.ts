// tipado para usar session en params
import session from "express-session";
import { User } from "./user.interface";

declare module "express-session" {
  interface SessionData {
    user: User;
    counter?: number;
  }
}
