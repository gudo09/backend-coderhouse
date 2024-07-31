import { Request, Response, NextFunction } from "express";

import winston from "winston";

import config from "@/config.js";

const customLevelsOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "magenta",
    warning: "yellow",
    info: "blue",
    http: "cyan",
    debug: "gray",
  },
};

const devLogger = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [
    // Solo muestra por consola en modo dev
    new winston.transports.Console({
      // nivel minimo de registros
      level: "debug",
      // colores personalizados
      format: winston.format.combine(winston.format.colorize({ colors: customLevelsOptions.colors }), winston.format.simple()),
    }),
  ],
});

const prodLogger = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [
    // Muestra por consola en modo prod
    new winston.transports.Console({
      // nivel minimo de registros
      level: "info",
      // colores personalizados
      format: winston.format.combine(winston.format.colorize({ colors: customLevelsOptions.colors }), winston.format.simple()),
    }),

    // Guarda un archivo .log para los registros en modo prod
    new winston.transports.File({ level: "info", filename: `${config.DIRNAME}/logs/errors.log` }),
  ],
});

// middleware para uso general en app.ts
const addLogger = (req: Request, res: Response, next: NextFunction) => {
  // Uso dinamicamente el logger
  config.MODE === "dev" ? (req.logger = devLogger) : (req.logger = prodLogger);

  req.logger.http(`${new Date().toString()} ${req.method} ${req.url}`);
  next();
};

export default addLogger;
