import CustomRouter from "./custom.routes.ts";

import { Request, Response } from "express";

import { uploader } from "@src/services/uploader.ts";

export default class UploadCustomRouter extends CustomRouter {
  init() {
    this.post("/images/products", uploader.array("productImages", 3), async (req: Request, res: Response) => {
      try {
        res.sendSuccess({ files: req.files }, "Imagenes subidas correctamente.");
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.post("/documents/premiumRequests", uploader.array("documentImages", 3), async (req: Request, res: Response) => {
      
    });

    this.post("/images/profiles", uploader.single("profileImage"), async (req: Request, res: Response) => {
      try {
        res.sendSuccess({ files: req.file }, "Imagenes subidas correctamente.");
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });
  }
}
