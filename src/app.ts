import express from "express";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import handlebars from "express-handlebars";
//import session from "express-session";
//import MongoStore from "connect-mongo";
import passport from "passport";
import cors from "cors";
import swaggerJsdoc, { Options } from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

import config from "./config.ts";
import initSocket from "./services/socket.ts";
import _MongoSingleton from "./services/mongodb.singleton.ts";
//import _errorsHandler from "./services/errors.handler.ts";
import addLogger from "./services/logger.ts";

import ViewsCustomRouter from "./routes/viewsCustom.routes.ts";
import ProductsCustomRouter from "./routes/productsCustom.routes.ts";
import UsersCustomRouter from "./routes/usersCustom.routes.ts";
import CartsCustomRouter from "./routes/cartsCustom.routes.ts";
import TicketsCustomRouter from "./routes/ticketsCustom.routes.ts";
import AuthCustomRouter from "./routes/authCustom.routes.ts";
import LoggingCustomRouter from "./routes/loggingCustom.routes.ts";
import DevCustomRouter from "./routes/devCustom.routes.ts";
import UploadCustomRouter from "./routes/uploadCustom.routes.ts";

/*
import cluster from "cluster";
import { cpus } from "os";
if (cluster.isPrimary) {
  const numCPUs = cpus().length;
  let workersReady = 0;
  let dbInstances = 0;

  // Creo instancias equivalente a la cantidad de nucleos que tengo disponibles
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();

    // Escucha el mensaje del worker indicando que está listo
    worker.on("message", (message) => {
      if (message === "ready") {
        workersReady += 1;

        // Si todos los workers están listos, muestra el mensaje
        if (workersReady === numCPUs) {
          console.log(`Ruta raíz: ${config.DIRNAME}`);
          console.log(`Todos los workers están listos. Puedes acceder desde ${config.BASE_URL}/login`);
        }
      }

      if (message === "readyDB") {
        dbInstances += 1;

        // Si todos los workers están conectados a la base de datos
        if (dbInstances === numCPUs) {
          console.log("Todos los procesos tienen conexión a la base de datos.");
        }
      }
    });
  }

  // Si una instancia se cae, la levanto nuevamente con un nuevo pid
  cluster.on("exit", (worker, _code, _signal) => {
    console.log(`Se cayó la instancia${worker.process.pid}`);
    cluster.fork();
  });

  cluster.on("error", (err, worker) => {
    console.error(`Worker ${worker.process.pid} error: ${err.message}`);
  });
} else {
  try {
  } catch (err) {
    console.error("Error en el bloque 'else':", (err as Error).message);
  }
}
*/

//Creo un a instancia del servidor de express, determino el puerto donde va a iniciar y una instancia del ProductManager
const app = express();

//ruta para archivos estaticos
app.use("/static", express.static(`${config.DIRNAME}/public`));

//configuraciones de express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//configuraciones de cors
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }));

// configuraciones de session NOTE: DESHABILITADO
/*
    app.use(
      session({
        store: MongoStore.create({ mongoUrl: config.MONGOBD_URI, ttl: 300, collectionName: `sessions` }),
        secret: config.SECRET,
        resave: true,
        saveUninitialized: true,
      })
    );
    */

app.use(passport.initialize());
//app.use(passport.session());
app.use(cookieParser(config.SECRET));

// configuraciones Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", `${config.DIRNAME}/views`);
app.set("view engine", "handlebars");

// uso el Logger para registros
app.use(addLogger);

// hago uso de las rutas
// Instancio un objeto de TestCustomRouter
// y llamo al getRouter para que me devuelva un tipo express.Router
app.use("/api/products", new ProductsCustomRouter().getRouter());
app.use("/api/users", new UsersCustomRouter().getRouter());
app.use("/api/carts", new CartsCustomRouter().getRouter());
app.use("/api/sessions", new AuthCustomRouter().getRouter());
app.use("/api/tickets", new TicketsCustomRouter().getRouter());
app.use("/api/log", new LoggingCustomRouter().getRouter());
app.use("/api/dev", new DevCustomRouter().getRouter());
app.use("/api/upload", new UploadCustomRouter().getRouter());
app.use("/", new ViewsCustomRouter().getRouter());

// Middleware para manejar rutas no encontradas (404)
app.use((req, res) => {
  res.render("pages/404");
});

/** Generamos objeto base config Swagger y levantamos endpoint para servir la documentación
 *
 *
 */
const swaggerOptions: Options = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentación sistema Coder_53160",
      description: "Esta documentación cubre toda la API habilitada para AdoptMe",
      version: "1.0.0",
    },
  },
  apis: ["./src/docs/**/*.yaml"], // todos los archivos de configuración de rutas estarán aquí
};
const specs = swaggerJsdoc(swaggerOptions);
app.use("/api/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// FIXME: Falta impementar (implementado pero falta testear)
//app.use(errorsHandler);

// Creo el servidor HTTP
const server = createServer(app);

// Inicializo Socket.IO
initSocket(server);

// Pongo el servidor a escuchar en el puerto de la configuración
server.listen(config.PORT, async () => {
  console.log(`Servidor iniciado en el puerto ${config.PORT} (PID ${process.pid})`);
  console.log(`Ruta raíz: ${config.DIRNAME}`);
  console.log(`Puedes acceder desde ${config.BASE_URL}/login`);
});
