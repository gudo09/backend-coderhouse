import { User as UserModel } from "../models/users.model.ts";

declare global {
  namespace Express {
    interface Request {
      user?: UserModel;
    }
  }
}
