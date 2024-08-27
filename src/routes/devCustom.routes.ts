import { Request, Response } from "express";
import CustomRouter from "./custom.routes.ts";
import mongoose from "mongoose";

export default class DevCustomRouter extends CustomRouter {
  init() {
    this.get("/db", async (req: Request, res: Response) => {
      try {
        const dbName = mongoose.connection.name;
        const environment = dbName.endsWith('_test') ? 'TEST' : 'PROD';
        res.sendSuccess(environment)
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });
  }
}
