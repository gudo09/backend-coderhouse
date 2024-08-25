import CustomRouter from "../routes/custom.routes.ts";
import { transport } from "../services/transportNodemailer.ts";
import TicketsController from "../controllers/tickets.controller.mdb.ts";
import config from "../config.ts";
import { Request, Response } from "express";

const _controller = new TicketsController();

export default class TicketsCustomRouter extends CustomRouter {
  init() {
    this.get("/mail", async (_req: Request, res: Response) => {
      try {
        const mail = await transport.sendMail({
          from: `Sistema Coder <${config.GMAIL_APP_USER}>`,
          to: "francogudino12@gmail.com",
          subject: "Solicitud de cambio de contraseña",
          html: `<h1>Prueba</h1>`,
          attachments: [],
        });
        res.sendSuccess({ sendedMail: mail });
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });
  }
}
