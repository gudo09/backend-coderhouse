import config, { errorsDictionary } from "@/config.js";
import { NextFunction } from "express";
import CustomError from "@services/customError.class.js";

type ErrorKey =  keyof typeof errorsDictionary;

const errorsHandler = (error: CustomError, req: Request, res: Response, next: NextFunction) => {
  const firstKey = Object.keys(errorsDictionary)[0] as ErrorKey; // Objengo la primera clave forzando que sea de tipo ErrorKey
  let customErr = errorsDictionary[firstKey] ; // Accede al valor usando la primera clave

  for (const key in customErr) {
    if (errorsDictionary[key as ErrorKey].code === error.type.code) customErr = errorsDictionary[key as ErrorKey] ;
  }

  return res.status(customErr.status).send({ origin: config.SERVER, payload: "", error: customErr });
};

export default errorsHandler;
