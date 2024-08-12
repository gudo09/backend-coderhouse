import CustomRouter from "../routes/custom.routes.js";
import { transport } from "../services/transportNodemailer.js";
import TicketsController from "../controllers/tickets.controller.mdb.js";
import config from "../config.js";

const controller = new TicketsController();


export default class TicketsCustomRouter extends CustomRouter {
  init() {
    this.get("/mail",async (req, res) => {
      try {
        const mail = await transport.sendMail({
          from: `Sistema Coder <${config.GMAIL_APP_USER}>`,
          to: "francogudino12@gmail.com",
          subject: "Solicitud de cambio de contraseña",
          html: `<h1>Prueba</h1>`,
          attachments: [],
        });
        res.sendSuccess({sendedMail: mail})
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });
  }
}
