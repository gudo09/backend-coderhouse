import { Request, Response, NextFunction } from "express";
import config, { errorsDictionary } from "@/config.js";
import CustomError from "@services/customError.class.js";

type ErrorKey =  keyof typeof errorsDictionary;


//middleware de express para lanzar errores persinalizados
//se usa en el app.js
const errorsHandler = (error: CustomError, req: Request, res: Response, next: NextFunction) => {
  const firstKey = Object.keys(errorsDictionary)[0] as ErrorKey; // Obtengo la primera clave forzando que sea de tipo ErrorKey
  let customErr = errorsDictionary[firstKey] ; // Accedo al valor usando la primera clave (es la primera por defecto)

  //recorro el diccionario y busco un error que coincida con el que recibo por parametro
  for (const key in errorsDictionary) {
    if (errorsDictionary[key as ErrorKey].code === error.type.code) customErr = errorsDictionary[key as ErrorKey] ;
  }

  return res.status(customErr.status).send({ origin: config.SERVER, payload: "", error: customErr });
};

export default errorsHandler;
