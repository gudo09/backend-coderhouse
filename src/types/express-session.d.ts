// tipado para usar session en params
import session from "express-session";
import { UserSessions } from "@models/users.model.ts";

declare module "express-session" {
  interface SessionData {
    user: UserSessions;
    counter?: number;
  }
}
