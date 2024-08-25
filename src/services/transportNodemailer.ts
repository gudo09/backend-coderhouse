import nodemailer from "nodemailer";
import config from "../config.ts";

export const transport = nodemailer.createTransport({
  service: "gmail",
  //pueto 587 es un puerto seguro (cifrado)
  port: 587,
  auth: {
    user: config.GMAIL_APP_USER,
    pass: config.GMAIL_APP_PASSWORD,
  },
});
