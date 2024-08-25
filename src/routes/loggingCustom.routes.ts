import { Request, Response } from "express";
import CustomRouter from "./custom.routes.ts";

export default class LoggingCustomRouter extends CustomRouter {
  init() {
    this.get("/loggerTest/:type", async (req: Request, res: Response) => {
      try {
        const loggerType: string = req.params.type.toLowerCase();

        const response = async (type: keyof typeof req.logger) => {
          req.logger[type](`${new Date().toString()} Este es un logging de tipo ${type.toString().toUpperCase()}. ${req.method} ${req.url}`);
          res.sendSuccess(type.toString().toUpperCase());
        };

        switch (loggerType) {
          case "fatal":
            await response("fatal");
            break;
          case "error":
            await response("error");
            break;
          case "warning":
            await response("warning");
            break;
          case "info":
            await response("info");
            break;
          case "http":
            await response("http");
            break;
          case "debug":
            await response("debug");
            break;
          default:
            res.sendServerError(new Error("Tipo de logger no válido."));
            break;
        }
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    //Siempre al último por si no entra a ningún otro endpoint
    this.router.all("*", async (req: Request, res: Response) => {
      res.sendServerError(new Error("No se encuentra la ruta seleccionada"));
    });
  }
}
