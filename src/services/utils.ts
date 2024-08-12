import { NextFunction, Request, Response } from "express";
import config from "../config.js";

import { User } from "../models/users.model.js";
import mongoose from "mongoose";

import bcrypt from "bcrypt";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

import { errorsDictionary } from "../config.js";
import CustomError from "./customError.class.js";

export const createHash = (password: string) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (enteredPassword: string, savedPassword: string) => bcrypt.compareSync(enteredPassword, savedPassword);

export const verifyRequiredBody = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Inicializo allOk como true
    let allOk = true;

    requiredFields.forEach((field) => {
      // Si el campo está presente y no es vacío, null o undefined; lo cambio a false
      if (!req.body?.hasOwnProperty(field) || req.body[field] === "" || req.body[field] === null || req.body[field] === undefined) allOk = false;
    });

    // Si alguna verificación falla, enviamos una respuesta de error
    if (!allOk) {
      res.sendServerError(new CustomError(errorsDictionary.FEW_PARAMETERS), requiredFields);
      return;
    }

    // Si todas las verificaciones pasan, continuamos con el siguiente middleware
    next();
  };
};

export const createToken = <T extends Object>(payload: T, duration: string) => jwt.sign(payload, config.SECRET, { expiresIn: duration });

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // el header tiene el formato "Bearer <Token>" así que con split(' ')[1] elimino el bearer
  const headerToken = req.headers.authorization ? req.headers.authorization.split(" ")[1] : undefined;
  const cookieToken = req.cookies && req.cookies[config.COOKIE_NAME] ? req.cookies[config.COOKIE_NAME] : undefined;
  const queryToken = req.query.access_token ? req.query.access_token : undefined;

  // el token puede venir por header, cookie o query
  const recivedToken = headerToken || cookieToken || queryToken;

  if (!recivedToken) return res.sendUserError(new Error("Se requiere token para poder acceder"));

  jwt.verify(recivedToken, config.SECRET, (err: VerifyErrors | null, payload: JwtPayload | string | undefined) => {
    if (err) return res.sendUserError(new Error("Token no válido"));

    // si el token pasa la varificacion, asignamos las credenciales al req.user

    console.log(payload);
    req.user = payload as User;
    console.log(req.user);

    next();
  });
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
