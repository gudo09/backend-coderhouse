import * as url from "url";
import dotenv from "dotenv";

dotenv.config();

const config = {
  APP_NAME: "coder_53160_FG",
  SERVER: "AtlasServer coder_53160",
  PORT: (process.env.PORT as string) || 8080,
  DIRNAME: url.fileURLToPath(new URL(".", import.meta.url)), //direccion absoluta del src
  MONGOBD_URI: process.env.MONGOBD_URI as string,
  SECRET: process.env.SECRET as string,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID as string,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET as string,
  MONGODB_ID_REGEX: /^[a-fA-F0-9]{24}$/,
  GITHUB_CALLBACK_PATH: process.env.GITHUB_CALLBACK_PATH as string,
  GMAIL_APP_USER: process.env.GMAIL_APP_USER as string,
  GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD as string,
  PERSISTENCE: "mongo",

  get COOKIE_NAME() {
    return `${this.APP_NAME}_cookie`;
  },

  get UPLOAD_DIR() {
    return `${this.DIRNAME}/public/images`;
  }, //src/public/images

  get BASE_URL() {
    return `${process.env.BASE_URL}:${this.PORT}`;
  }, // Base URL para el servidor

  get GITHUB_CALLBACK_URL() {
    return `${this.BASE_URL}${this.GITHUB_CALLBACK_PATH}`;
  },
};

// diccionario para manejar errores
export const errorsDictionary = {
  UNHANDLED_ERROR: { code: 0, status: 500, message: "Error no identificado" },
  ROUTING_ERROR: { code: 1, status: 404, message: "No se encuentra el endpoint solicitado" },
  FEW_PARAMETERS: { code: 2, status: 400, message: "Falta parámetros obligatorios o se enviaron vacíos" },
  INVALID_MONGOID_FORMAT: { code: 3, status: 400, message: "El ID no contiene un formato válido de MongoDB" },
  INVALID_PARMETER: { code: 4, status: 400, message: "El paámetro ingresado no es válido" },
  INVALID_TYPE_ERROR: { code: 5, status: 400, message: "No corresponde el tipo de dato" },
  ID_NOT_FOUND: { code: 6, status: 400, message: "No existe registro con ese ID" },
  PAGE_NOT_FOUND: { code: 7, status: 404, message: "No se encuentra la página solicitada" },
  DATABASE_ERROR: { code: 8, status: 500, message: "No se puede conectar con la base de datos" },
  INTERNAL_ERROR: { code: 9, status: 500, message: "Error interno de ejecución del servidor" },
  RECORD_CREATION_ERROR: { code: 10, status: 500, message: "Error al intentar crear el registro" },
  RECORD_CREATION_OK: { code: 11, status: 200, message: "Registro creado" },
};

export default config;
