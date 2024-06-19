import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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

export const createToken = (payload: {}, duration: string) => jwt.sign(payload, config.SECRET, { expiresIn: duration });

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // el header tiene el formato "Bearer <Token>" así que con split(' ')[1] elimino el bearer 
  const headerToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : undefined;

  if (!headerToken) return res.status(401).send({ origin: config.SERVER, payload: 'Se requiere token para poder acceder' })

  jwt.verify(headerToken, config.SECRET, (err, credetnials) => {
    if (err) return  res.status(403).send({origin: config.SERVER, payload: 'Token no válido'})
    
    // si el token pasa la varificacion, asignamos las credenciales al req.user
    req.user = credetnials
    next();
  })
  
};
