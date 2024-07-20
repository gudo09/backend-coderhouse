import CustomRouter from "@routes/custom.routes.js";
import nodemailer from "nodemailer";
import TicketsController from "@controllers/tickets.controller.mdb.js";
import config from "@/config.js";

const controller = new TicketsController();

const transport = nodemailer.createTransport({
  service: "gmail",
  //pueto 587 es un puerto seguro (cifrado)
  port: 587,
  auth: {
    user: config.GMAIL_APP_USER,
    pass: config.GMAIL_APP_PASSWORD,
  },
});

export default class TicketsCustomRouter extends CustomRouter {
  init() {
    this.get("/mail",async (req, res) => {
      try {
        const mail = await transport.sendMail({
          from: `Sistema Coder <${config.GMAIL_APP_USER}>`,
          to: "francogudino12@gmail.com",
          subject: "Prueba nodemailer",
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
