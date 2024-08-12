import { Response, Request, NextFunction } from "express";
import CustomRouter from "./custom.routes.js";
import UsersController from "../controllers/users.controller.mdb.js";
import config from "../config.js";
import { transport } from "../services/transportNodemailer.js";
import { createToken } from "../services/utils.js";
import CustomError from "../services/customError.class.js";
import { errorsDictionary } from "../config.js";

const controller = new UsersController();

export default class UsersCustomRouter extends CustomRouter {
  init() {
    this.router.param("id", async (req, res, next, pid) => {
      if (!config.MONGODB_ID_REGEX.test(pid)) {
        return res.sendServerError(new Error("Id no válido"));
      }

      next();
    });

    this.get("/paginate/:page/:limit", async (req, res) => {
      try {
        const filter = { role: "admin" };
        const options = { page: parseInt(req.params.page), limit: parseInt(req.params.limit), sort: { lastName: 1 } };
        const process = await controller.getPaginated(filter, options);

        res.sendSuccess(process);
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.post("/", async (req, res) => {
      try {
        const process = await controller.add(req.body);
        res.sendSuccess(process);
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.put("premium/:uid", async (req, res) => {
      //Permitirá cambiar el rol de un usuario, de “user” a “premium” y viceversa.
    });

    this.put("/:id", async (req, res) => {
      try {
        const filter = { _id: req.params.id };
        const update = req.body;
        const options = { new: true };
        const process = await controller.update(filter, update, options);

        res.sendSuccess(process);
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.delete("/:id", async (req, res) => {
      try {
        const filter = { _id: req.params.id };
        const process = await controller.delete(filter);
        res.sendSuccess(process);
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    // Falta implementar
    this.get("/restorePassword", async (req, res) => {
      // Le ofrecemos la opcion de restaurar la contraseña al usuario
      // el usuario solo debe ingresar su email
      try {
        res.render("restorePassword", { showError: req.query.message ? true : false, message: req.query.message });
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    // Falta implementar
    this.post("/sendMailRestorePassword", async (req, res) => {
      // Este endpoint se encarga de enviar el mail para reestablecer la contraseña
      // Se busca el usuario por su email
      // Si existe, se genera el token de corta duracion (5 min)
      // se genera y se envia el enlace a /restorePassword/:token
      try {
        const email = req.body.email;

        const foundUser = await controller.getOne({ email });

        if (!foundUser) res.redirect(`/api/users/restorePassword?message=${encodeURI("Usuario no encontrado")}`);

        const token = createToken({ email: email }, "10m");
        const resetLink = `${config.BASE_URL}/api/users/restoreConfirmPassword/?token=${token}`;
        const sendedMail = await transport.sendMail({
          from: `Sistema Coder <${config.GMAIL_APP_USER}>`,
          to: `${email.toString()}`,
          subject: "Prueba nodemailer",
          html: `<!DOCTYPE html>
                  <html lang="es">
                  <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Solicitud de cambio de contraseña</title>
                    <style>
                      body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        color: #333;
                        margin: 0;
                        padding: 20px;
                      }
                      .container {
                          background-color: #fff;
                          padding: 30px;
                          border-radius: 8px;
                          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                          max-width: 600px;
                          margin: 0 auto;
                      }
                      h1 {
                          color: #333;
                      }
                      p {
                          font-size: 16px;
                          line-height: 1.5;
                      }
                      .button {
                          display: inline-block;
                          background-color: #4CAF50;
                          color: #fff;
                          padding: 10px 20px;
                          text-decoration: none;
                          border-radius: 5px;
                          margin-top: 20px;
                      }
                      .button:hover {
                          background-color: #45a049;
                      }
                      .footer {
                          margin-top: 30px;
                          font-size: 12px;
                          color: #777;
                      }
                    </style>
                  </head>
                  <body>
                      <div class="container">
                          <h1>Solicitud de Cambio de Contraseña</h1>
                          <p>Hola,</p>
                          <p>Hemos recibido una solicitud para cambiar la contraseña de tu cuenta. Si no realizaste esta solicitud, puedes ignorar este correo.</p>
                          <p>Para cambiar tu contraseña, haz clic en el siguiente botón:</p>
                          <a href="${resetLink}" class="button">Cambiar Contraseña</a>
                          <p>O copia y pega el siguiente enlace en tu navegador:</p>
                          <p><a href=${resetLink}>${resetLink}</a></p>
                          <p>Este enlace es válido sólo por 10 minutos. Si no cambias tu contraseña en ese tiempo, necesitarás solicitar un nuevo enlace.</p>
                          <div class="footer">
                              <p>Si tienes alguna duda, puedes contactar con nuestro equipo de soporte.</p>
                              <p>&copy; 2024 Sistema Coder. Todos los derechos reservados.</p>
                          </div>
                      </div>
                  </body>
                  </html>`,
          attachments: [],
        });

        if (!sendedMail) throw new CustomError(errorsDictionary.NODEMAILER_SEND_ERROR);

        res.render("sendPasswordEmailSuccess", { emailTo: sendedMail.envelope.to });
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    // Falta implementar
    this.get("/restoreConfirmPassword", async (req: Request, res: Response) => {
      // Este endpoint recibe el token generado para cambiar la contraseña
      // Debe estar protegida por un token de corta duracion
      // Si el token expira, debe redireccionar a /restorePassword
      // Debe incluir un formulario donde debe repetir la nueva contraseña
      // No debe ser igual a la anterior contraseña (verificar que los hash nuevo y anterior sean distintos)
      try {
        res.sendSuccess("Token contraseña");
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.router.all("*", async (req, res) => {
      res.sendServerError(new Error("No se encuentra la ruta seleccionada"));
    });
  }
}

/*
**
 * Aggregate nos permite ejecutar varios procesos en una misma consulta.
 * Muy útil cuando necesitamos generar estadísticas o calcular totales
 * sobre las consultas, es decir, no retornar los datos de la colección
 * tal cual se encuentran almacenados, sino realizar cálculos sobre esos
 * datos en la propia consulta.
 * 
 * En este ejemplo, efectuamos 3 procesos (stages):
 * 1- Filtrado por rol.
 * 2- Agrupamiento y cálculo de suma total de grades por región (ver modelo).
 * 3- Ordenamiento por total de grades descendente (-1).

router.get('/aggregate/:role', async (req, res) => {
    try {
        if (req.params.role === 'admin' || req.params.role === 'premium' || req.params.role === 'user') {
            const match = { role: req.params.role };
            const group = { _id: '$region', totalGrade: {$sum: '$grade'} };
            const sort = { totalGrade: -1 };
            const process = await controller.getAggregated(match, group, sort);

            res.status(200).send({ origin: config.SERVER, payload: process });
        } else {
            res.status(200).send({ origin: config.SERVER, payload: null, error: 'role: solo se acepta admin, premium o user' });
        }
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: (err as Error).message });
    }
});
*/
