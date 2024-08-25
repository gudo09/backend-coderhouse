// .mocharc.js
import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  require: ["ts-node/register"],
  spec: path.resolve(__dirname, "src/test/**/*.test.ts"),
  extension: ["ts"],
  recursive: true,
  "node-option": ["--loader=ts-node/esm"],
};
