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

export default config;
