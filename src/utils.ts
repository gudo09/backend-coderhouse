import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import config from "@/config.js";

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
      res.status(400).send({ origin: config.SERVER, payload: "Faltan propiedades", requiredFields });
      return;
    }

    // Si todas las verificaciones pasan, continuamos con el siguiente middleware
    next();
  };
};
