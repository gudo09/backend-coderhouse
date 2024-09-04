import path from "path";
import multer from "multer";
import moment from "moment";
import fs from "fs/promises"

import config from "@src/config.ts";

const storage = multer.diskStorage({
  // Defino la ruta de destino a la que se subirá la imagen
  destination: async (req, file, cb) => {
    const dir = path.join(config.UPLOAD_DIR, req.path)
    
    // Verifica si el directorio existe; si no, créalo de manera asíncrona
    await fs.mkdir(dir, { recursive: true })

    // el calback va al ultimo
    cb(null, dir);
  },

  // Defino el nombre con el que se subirá la imagen
  filename: (req, file, cb) => {
    cb(null, `${moment().format('YYYYMMDDmmss')}-${file.originalname}`);
  },
});

export const uploader = multer({ storage: storage });
