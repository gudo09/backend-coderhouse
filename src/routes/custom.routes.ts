import { NextFunction, Router, Request, Response } from "express";

import config from "@/config.js";

//tipado para params y callbacks
//Request y Response son requeridos, el resto opcionales
type ExpressParams = [Request, Response, NextFunction?, ...any[]];
type ExpressCallBacks = (...params: ExpressParams) => any;

export default class CustomRouter {
  router: Router;

  //llama al metodo generateCustomResponses() para hacer el codigo más limpio
  customResponseHandler = (req: Request, res: Response, next: NextFunction) => this.generateCustomResponses(req, res, next)
  
  constructor() {
    this.router = Router();
    this.init();
  }
  
  init() {}
  
  getRouter() {
    return this.router;
  }
  
  applyCallbacks(callBacks: ExpressCallBacks[]) {
    return callBacks.map((callBack) => async (...params: ExpressParams) => {
      try {
        //el metodo apply aplica los params para ejecutar cada uno de los callbacks
        //se usa this para referenciar el contexto de la instancia
        await callBack.apply(this, params);
      } catch (err) {
        console.log(err as Error);
        //params[1] hace referecia al parametro res del callback
        params[1].status(500).send({ origin: config.SERVER, payload: null, message: (err as Error).message });
      }
    });
  }
  
  //respuestas personalizadas
  generateCustomResponses(req: Request, res: Response, next: NextFunction) {
    res.sendSuccess = (payload) => res.status(200).send({ origin: config.SERVER, payload: payload });
    res.sendUserError = (err) => res.status(400).send({ origin: config.SERVER, payload: null, message: err.message });
    res.sendServerError = (err) => res.status(500).send({ origin: config.SERVER, payload: null, message: err.message });
    next();
  }

  //...callBacks: contine tanto el callback del la solicitud, como los midllewares
  get(path: string, ...callBacks: ExpressCallBacks[]) {
    this.router.get(path, this.customResponseHandler, ...this.applyCallbacks(callBacks));
  }

  post(path: string, ...callBacks: ExpressCallBacks[]) {
    this.router.post(path, this.customResponseHandler, ...this.applyCallbacks(callBacks));
  }

  put(path: string, ...callBacks: ExpressCallBacks[]) {
    this.router.put(path, this.customResponseHandler, ...this.applyCallbacks(callBacks));
  }

  delete(path: string, ...callBacks: ExpressCallBacks[]) {
    this.router.delete(path, this.customResponseHandler, ...this.applyCallbacks(callBacks));
  }
}
