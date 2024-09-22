import UsersController from "../controllers/users.controller.mdb.ts";
import config from "../config.ts";
import passport from "passport";

import { User } from "../models/users.model.ts";

import { createToken, handlePolicies, verifyRequiredBody, verifyToken } from "../services/utils.ts";
import CustomRouter from "../routes/custom.routes.ts";

import initAuthStrategies, { passportCall } from "../auth/passport.strategies.ts";
import { Request, Response } from "express";

const usersController = new UsersController();
initAuthStrategies();

export default class AuthCustomRouter extends CustomRouter {
  init() {
    //login con github a traves de passport
    this.get("/ghlogin", passport.authenticate("ghlogin", { scope: ["user"] }), async (_req: Request, _res: Response) => {});

    // FIXME: esto deberia hacerse con JWT
    this.get("/ghlogincallback", passport.authenticate("ghlogin", { failureRedirect: `/login?error=${encodeURI("Error al identificar con Github.")}` }), async (req: Request, res: Response) => {
      try {
        const token = createToken(req.user as User, "1h");

        // Seteo la cookie con el token de JWT en el cliente
        res.cookie(config.COOKIE_NAME, token, { maxAge: 60 * 60 * 1000 * 24, httpOnly: true });

        req.logger.debug(`${new Date().toString()} Usuario autenticado con Github. Token: ${token} ${req.method} ${req.url}`);

        res.redirect("/profile");
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.get("/logout", async (req: Request, res: Response) => {
      try {
        //destruyo los datos de la cookie y de req.user
        res.clearCookie(config.COOKIE_NAME);
        req.user = undefined;

        return res.redirect("/login");
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    // FIXME: Falta corregir, debe hacerse el registro con jwt
    this.post("/register", verifyRequiredBody(["firstName", "lastName", "email", "password"]), passportCall("register"), async (req: Request, res: Response) => {
      try {
        if (!req.user) {
          throw new Error("Error de usuario");
        }
        const { password, ...filteredUser } = req.user;
        req.logger.debug(`Intentando registrar al usuario con el email: ${filteredUser.email} y password: ${password}`);

        const token = createToken(req.user, "1h");

        // Seteo la cookie con el token de JWT en el cliente
        res.cookie(config.COOKIE_NAME, token, { maxAge: 60 * 60 * 1000 * 24, httpOnly: true });

        res.redirect("/profile");
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    /** Login con JWT y passport local
     * usa passport base para el login y crea un token en la cookie con jwt
     */
    this.post("/login", verifyRequiredBody(["email", "password"]), passportCall("login"), async (req: Request, res: Response) => {
      try {
        // Acá req.user ya debería estar definido por passport
        if (!req.user) {
          console.log (req.user)
          return res.sendServerError(new Error("Error al autenticarse."));
        }

        const token = createToken(req.user as User, "1h");

        // Seteo la cookie con el token de JWT en el cliente
        res.cookie(config.COOKIE_NAME, token, { maxAge: 60 * 60 * 1000 * 24, httpOnly: true });

        req.logger.debug(`${new Date().toString()} Usuario autenticado. Token: ${token} ${req.method} ${req.url}`);
        res.redirect("/profile");
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    /** Validar permisos admin con jwt
     * verifica el token con jwt para acceder a admin
     * funciona tanto como por req.query.access_token, header (con prefijo "Bearer") ó
     * con cookies. Todo esto lo gestiona "verifyToken"
     */
    this.get("/jwtLocalAdmin", verifyToken("auth"), handlePolicies(["admin"]), async (req: Request, res: Response) => {
      try {
        res.sendSuccess("Bienvenido admin.");
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    /** Validar permisos admin con passport-jwt
     * verifica el token con passport-jwt mediante el middleware passportCall y la estrategia jwtlogin para acceder a admin
     * usa cookies, es decir que requiere estar logueado con las cookies cargadas con el token
     */
    this.get("/jwtppAdmin", passportCall("jwtlogin"), handlePolicies(["admin"]), async (req: Request, res: Response) => {
      try {
        res.sendSuccess("Bienvenido admin.");
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });
  }
}
