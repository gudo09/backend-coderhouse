import * as url from "url";
const config = {
    PORT: 8080,
    DIRNAME: url.fileURLToPath(new URL(".", import.meta.url)), //direccion absoluta del src
    get UPLOAD_DIR() { return `${this.DIRNAME}/public/images}`; } //src/public/images
};
export default config;
