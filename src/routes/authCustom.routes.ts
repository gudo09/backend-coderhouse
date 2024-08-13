import UsersController from "../controllers/users.controller.mdb.js";
import config from "../config.js";
import passport from "passport";

import { User, UserSession } from "../models/users.model.js";

import { createToken, handlePolicies, verifyRequiredBody, verifyToken } from "../services/utils.js";
import CustomRouter from "../routes/custom.routes.js";

import initAuthStrategies, { passportCall } from "../auth/passport.strategies.js";

const usersController = new UsersController();
initAuthStrategies();

export default class AuthCustomRouter extends CustomRouter {
  init() {
    // valida los datos requeridos en el body
    this.post("/login", verifyRequiredBody(["email", "password"]), async (req, res) => {
      try {
        const { email, password } = req.body;
        const login = await usersController.login(email, password);

        if (!login) {
          console.log("Datos de acceso no válidos.");
          res.redirect(`/login?error=${encodeURI("Usuario o contraseña no válidos.")}`);
          return;
        }

        req.session.user = { email: login.email, firstName: login.firstName, lastName: login.lastName, role: login.role };
        res.redirect("/profile");
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    // login con passort y session
    this.post("/pplogin", verifyRequiredBody(["email", "password"]), passport.authenticate("login", { failureRedirect: `/login?error=${encodeURI("Usuario o contraseña no válidos.")}` }), async (req, res) => {
      try {
        const { email, password: _password } = req.body;
        const login = await usersController.login(email, _password);

        if (!login) {
          console.log("Datos de acceso no válidos.");
          res.redirect(`/login?error=${encodeURI("Usuario o contraseña no válidos.")}`);
          return;
        }

        const { password, ...filteredUser } = login; //.toJSON(); // toJSON() para evitar el formateo de mongoose

        req.session.user = filteredUser;

        // Uso req.session.save para mantener la asincronía
        req.session.save((err) => {
          if (err) res.sendServerError(err as Error);
          res.redirect("/profile");
        });
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    //login con github a traves de passport
    this.get("/ghlogin", passport.authenticate("ghlogin", { scope: ["user"] }), async (req, res) => {});

    this.get("/ghlogincallback", passport.authenticate("ghlogin", { failureRedirect: `/login?error=${encodeURI("Error al identificar con Github.")}` }), async (req, res) => {
      try {
        req.session.user = req.user as UserSession;
        req.session.save((err) => {
          if (err) return res.sendServerError(err as Error);
          res.redirect("/profile");
        });
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.get("/logout", async (req, res) => {
      try {
        //destruyo los datos de la sesion
        req.session.destroy((err) => {
          if (err) return res.sendServerError(err as Error);
          return res.redirect("/login");
        });
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.post("/register", verifyRequiredBody(["firstName", "lastName", "email", "password"]), passport.authenticate("register", { failureRedirect: `/register?error=${encodeURI("Error al registrar usuario.")}` }), async (req, res) => {
      try {
        const { email, password: _password } = req.body;
        const login = await usersController.login(email, _password);

        if (!login) {
          console.log("Error al registrar usuario.");
          res.redirect(`/register?error=${encodeURI("Error al registrar usuario.")}`);
          return;
        }

        const { password, ...filteredUser } = login; //.toJSON(); // toJSON() para evitar el formateo de mongoose

        req.session.user = filteredUser;

        // Uso req.session.save para mantener la asincronía
        req.session.save((err) => {
          if (err) res.sendServerError(err as Error);
          res.redirect("/profile");
        });
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.get("/current", passportCall("jwtlogin"), async (req, res) => {
      try {
        const currentUserFirstName = (req.user as User).firstName;
        const currentUserLastName = (req.user as User).lastName;
        res.sendSuccess(`El usuario actualmente autenticado es ${currentUserFirstName} ${currentUserLastName}`);
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    // usa passport base para el login y crea un token en la cookie con jwt
    this.post("/jwtlogin", verifyRequiredBody(["email", "password"]), passport.authenticate("login", { failureRedirect: `/login?error=${encodeURI("Usuario o contraseña no válidos.")}` }), async (req, res) => {
      try {
        if (!req.user) return res.sendUserError(new Error("Usuario no encontrado."));
        req.session.user = req.user;
        const token = createToken(req.user as User, "1h");
        res.cookie(config.COOKIE_NAME, token, { maxAge: 60 * 60 * 1000 * 24, httpOnly: true });
        req.logger.debug(`${new Date().toString()} Usuario autenticado. Token: ${token} ${req.method} ${req.url}`);
        res.redirect("/profile")
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    // verifica el token con jwt para acceder a admin
    // funciona tanto como por req.query.access_token, header (con prefijo "Bearer") ó
    // con cookies. Todo esto lo gestiona "verifyToken"
    this.get("/jwtLocalAdmin", verifyToken("auth"), handlePolicies(["admin"]), async (req, res) => {
      try {
        res.sendSuccess("Bienvenido admin.");
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    // verifica el token con passport-jwt mediante el middleware passportCall y la estrategia jwtlogin para acceder a admin
    // usa cookies, es decir que requiere estar logueado con las cookies cargadas con el token
    this.get("/jwtppAdmin", passportCall("jwtlogin"), handlePolicies(["admin"]), async (req, res) => {
      try {
        res.sendSuccess("Bienvenido admin.");
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    //Siempre al último por si no entra a ningún otro endpoint
    this.router.all("*", async (req, res) => {
      res.sendServerError(new Error("No se encuentra la ruta seleccionada"));
    });
  }
}
