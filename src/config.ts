import * as url from "url";

const config = {
  PORT: 8080,
  DIRNAME: url.fileURLToPath(new URL(".", import.meta.url)),//direccion absoluta del src
  get UPLOAD_DIR() {return `${this.DIRNAME}/public/images}`}, //src/public/images
  get BASE_URL() { return `http://localhost:${this.PORT}`; }, // Base URL para el servidor
  MONGOBD_URI: `mongodb+srv://gudo09-dev:JMUcYFKhiisSIKKg@clustergudo09-dev.kxymklh.mongodb.net/coder_53160`
};

export default config;
