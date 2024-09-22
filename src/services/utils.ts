import { NextFunction, Request, Response } from "express";
import config from "../config.ts";

import { User } from "../models/users.model.ts";
import mongoose from "mongoose";

import bcrypt from "bcrypt";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

import { errorsDictionary } from "../config.ts";
import CustomError from "./customError.class.ts";

/** Crea un hash (o encriptado) de la contraseña recibida
 *
 * @param {string} password Contraseña a encriptar
 * @returns {string} Contraseña hasheada
 */
export const createHash = (password: string) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

/** Compara dos contraseñas encriptadas
 *
 * @param {string} enteredPassword Contraseña ingresada por el usuario (encriptada)
 * @param {string} savedPassword Contraseña con la cual comparar (encriptada)
 * @returns {boolean} Si las contraseñas coinciden o no
 */
export const isValidPassword = (enteredPassword: string, savedPassword: string) => bcrypt.compareSync(enteredPassword, savedPassword);

/** Verifica que el body contiene propiedades especificas
 *
 * @param {string []} requiredFields
 * @returns
 */
export const verifyRequiredBody = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Inicializo allOk como true
    let allOk = true;

    requiredFields.forEach((field) => {
      // Si el campo está presente y no es vacío, null o undefined; lo cambio a false
      if (!(field in req.body) || req.body[field] === "" || req.body[field] === null || req.body[field] === undefined) allOk = false;
    });

    // Si alguna verificación falla, enviamos una respuesta de error
    if (!allOk) {
      //res.sendServerError(new CustomError(errorsDictionary.FEW_PARAMETERS), requiredFields);
      res.sendServerError(new Error("Faltan campos requeridos"), requiredFields);
      return;
    }

    // Si todas las verificaciones pasan, continuamos con el siguiente middleware
    next();
  };
};

export const createToken = <T extends object>(payload: T, duration: string) => jwt.sign(payload, config.SECRET, { expiresIn: duration });

export const verifyToken = (typeToken: "auth" | "restorePassword" | "login") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!typeToken) return res.sendServerError(new Error("Se requiere indicar el tipo de token"));

    let headerToken;
    let cookieToken;
    let queryToken;

    switch (typeToken) {
      case "auth":
        // el header tiene el formato "Bearer <Token>" así que con split(' ')[1] elimino el bearer
        headerToken = req.headers.authorization ? req.headers.authorization.split(" ")[1] : undefined;
        cookieToken = req.cookies && req.cookies[config.COOKIE_NAME] ? req.cookies[config.COOKIE_NAME] : undefined;
        queryToken = req.query.access_token ? req.query.access_token : undefined;
        break;
      case "restorePassword":
        // El restore password token solo lo recibo por query
        queryToken = req.query.token || undefined;
        break;
    }

    // el token puede venir por header, cookie o query
    const receivedToken = headerToken || cookieToken || queryToken;

    // Si no se recibe un token
    if (!receivedToken) {
      // y no viene desde /login redirecciono con mensaje para que inicie sesión
      if (req.path !== "/login") {
        return res.redirect(`/login?error=${encodeURI("Se requiere iniciar sesión.")}`);
      } else {
        // caso contrario dejo que pase y muestre el /login
        return next();
      }
    }

    req.logger.debug(`token: ${receivedToken}`);
    // Envio respuesta en caso de que no se reciba un token

    jwt.verify(receivedToken, config.SECRET, (err: VerifyErrors | null, payload: string | JwtPayload | undefined) => {
      // si el token no es valido retorna undefined
      req.logger.debug(`token desencriptado: ${JSON.stringify(payload, null, 2)}`);
      req.logger.debug(`req.path: ${req.path}`);

      //Verificacion del token
      if (err) {
        // Respuesta token expirado
        if (err.name === "TokenExpiredError") {
          if (req.path !== "/login") return res.redirect(`/login?error=${encodeURI("Sesión expirada.")}`);
        }
        // Respuesta token no valido
        if (req.path !== "/login") return res.redirect(`/login?error=${encodeURI("Error al recuperar la sesión.")}`);
      }

      if (payload) {
        // Redirijo a /profile si el usuario ya esta autenticado con una cookie válida
        if (typeToken === "auth" && req.path === "/login") return res.redirect("/profile");
        req.logger.debug(`Token authentication: ${JSON.stringify(payload, null, 2)}`);
        // Guardo las credenciales en el req.user
        req.user = payload as User;
        req.logger.debug(`req.user: ${JSON.stringify(req.user, null, 2)}`);
      }

      if (typeToken === "restorePassword") {
        req.logger.debug(`Token restore password: ${JSON.stringify(payload, null, 2)}`);
        return res.render("restorePasswordConfirm");
      }

      next();
    });
  };
};

export const handlePolicies = (policies: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    policies = policies.map((policy) => policy.toLowerCase());

    // si es de acceso publico, no hace validaciones
    if (policies.includes("public")) return next();

    // so no está autenticado mando un a respuesta de error
    if (!req.user) return res.sendUserError(new Error("El usuario no está autenticado"));

    // si el usuario asociado al carrito es el mismo, procede
    if (policies.includes("self") && req.user.cart_id.toString() === req.params.cid) return next();

    if (policies.includes(req.user.role)) return next();
    // FALTA IMPLEMENTAR EL RESTO DE POLITICAS
    // DESPUES DE IMPLEMENTAR SE SEBE MOVER A LA CLASE CUSOMROUTES

    return res.status(403).sendUserError(new Error("No tiene permisos para acceder al recurso"));
    next();
  };
};

// middleware para validar el id
export const validateId = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.pid;

  // verifico que el id sea valido para mongoose
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.sendServerError(new Error("En id ingresado no es válido."));
    return;
  }

  next();
};

// middleware para validar el los campos del body
export const validateBody = async (req: Request, res: Response, next: NextFunction) => {
  //valido todos los campor requeridos en el body
  req.body.status = true;
  const { id, title, price, description, code, status, stock, category } = req.body;

  if (id) return res.sendServerError(new Error("No se debe enviar el id."));

  // uso error personalizado
  if (!title || !price || !description || !code || !status || !stock || !category) return res.sendServerError(new CustomError(errorsDictionary.FEW_PARAMETERS));

  next();
};
