import express from "express";
import cookieParser from "cookie-parser";
import handlebars from "express-handlebars";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import swaggerJsdoc, { Options } from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

import config from "./config.ts";
import initSocket from "./services/socket.ts";
import MongoSingleton from "./services/mongodb.singleton.ts";
import errorsHandler from "./services/errors.handler.ts";
import addLogger from "./services/logger.ts";

import ViewsCustomRouter from "./routes/viewsCustom.routes.ts";
import ProductsCustomRouter from "./routes/productsCustom.routes.ts";
import UsersCustomRouter from "./routes/usersCustom.routes.ts";
import CartsCustomRouter from "./routes/cartsCustom.routes.ts";
import TicketsCustomRouter from "./routes/ticketsCustom.routes.ts";
import AuthCustomRouter from "./routes/authCustom.routes.ts";
import LoggingCustomRouter from "./routes/loggingCustom.routes.ts";
import DevCustomRouter from "./routes/devCustom.routes.ts";

/*
import cluster from "cluster";
import { cpus } from "os";
if (cluster.isPrimary) {
  // Creo instancias equivalente a la cantidad de nucleos que tengo disponibles
  for (let i = 0; i < cpus.length; i++) cluster.fork();

  // Si una instancia se cae, la levanto nuevamente con un nuevo pid
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Se cayó la instancia${worker.process.pid}`);
    cluster.fork();

  });
  cluster.on("error", (err, worker) => {
    console.error(`Worker ${worker.process.pid} error: ${err.message}`);
  });
} else {
 
}
*/

try {
  //Creo un a instancia del servidor de express, determino el puerto donde va a iniciar y una instancia del ProductManager
  const app = express();

  //ruta para archivos estaticos
  app.use("/static", express.static(`${config.DIRNAME}/public`));

  const expressInstance = app.listen(config.PORT, async () => {
    // conecto mongoose con la base de datos en Atlas
    //await mongoose.connect(config.MONGOBD_URI);
    MongoSingleton.getInstance();

    //inicializo el server de socket.io desde el archivo socket.js
    const socketServer = initSocket(expressInstance);
    app.set("socketServer", socketServer);

    //configuraciones de express
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    //configuraciones de cors
    app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));

    // configuraciones de session
    app.use(
      session({
        store: MongoStore.create({ mongoUrl: config.MONGOBD_URI, ttl: 300, collectionName: `sessions` }),
        secret: config.SECRET,
        resave: true,
        saveUninitialized: true,
      })
    );
    app.use(passport.initialize());
    app.use(passport.session());
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
    app.use("/", new ViewsCustomRouter().getRouter());
    app.use("/api/products", new ProductsCustomRouter().getRouter());
    app.use("/api/users", new UsersCustomRouter().getRouter());
    app.use("/api/carts", new CartsCustomRouter().getRouter());
    app.use("/api/sessions", new AuthCustomRouter().getRouter());
    app.use("/api/tickets", new TicketsCustomRouter().getRouter());
    app.use("/api/log", new LoggingCustomRouter().getRouter());
    app.use("/api/dev", new DevCustomRouter().getRouter());

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

    // Falta impementar (implementado pero falta testear)
    //app.use(errorsHandler);

    console.log(`Ruta raíz: ${config.DIRNAME}`);
    console.log(`Puedes acceder desde ${config.BASE_URL}/login`);
    console.log(`Servidor iniciado en el puerto ${config.PORT} (PID ${process.pid})`);
  });
} catch (err) {
  console.log((err as Error).message);
}
