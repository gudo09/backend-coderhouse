import express from "express";
import cookieParser from "cookie-parser";
import handlebars from "express-handlebars";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import swaggerJsdoc, { Options } from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

import config from "./config.js";
import initSocket from "./services/socket.js";
import MongoSingleton from "./services/mongodb.singleton.js";
import errorsHandler from "./services/errors.handler.js";
import addLogger from "./services/logger.js";

import TestCustomRouter from "./routes/testCustom.routes.js";
import ViewsCustomRouter from "./routes/viewsCustom.routes.js";
import ProductsCustomRouter from "./routes/productsCustom.routes.js";
import UsersCustomRouter from "./routes/usersCustom.routes.js";
import CartsCustomRouter from "./routes/cartsCustom.routes.js";
import TicketsCustomRouter from "./routes/ticketsCustom.routes.js";
import AuthCustomRouter from "./routes/authCustom.routes.js";
import LoggingCustomRouter from "./routes/loggingCustom.routes.js";

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
        store: MongoStore.create({ mongoUrl: config.MONGOBD_URI, ttl: 300 }),
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
    app.use("/api/test", new TestCustomRouter().getRouter());
    app.use("/", new ViewsCustomRouter().getRouter());
    app.use("/api/products", new ProductsCustomRouter().getRouter());
    app.use("/api/users", new UsersCustomRouter().getRouter());
    app.use("/api/carts", new CartsCustomRouter().getRouter());
    app.use("/api/sessions", new AuthCustomRouter().getRouter());
    app.use("/api/tickets", new TicketsCustomRouter().getRouter());
    app.use("/api/log", new LoggingCustomRouter().getRouter());

    /**
     * Generamos objeto base config Swagger y levantamos endpoint para servir la documentación
     *
     */
    const swaggerOptions: Options = {
      definition: {
        openapi: "3.0.1",
        info: {
          title: "Documentación sistema AdoptMe",
          description: "Esta documentación cubre toda la API habilitada para AdoptMe",
          version: "1.0.0",
        },
      },
      apis: ["./src/docs/**/*.yaml"], // todos los archivos de configuración de rutas estarán aquí
    };
    const specs = swaggerJsdoc(swaggerOptions);
    app.use("/api/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

    app.use(errorsHandler);

    console.log(`Servidor iniciado en el puerto ${config.PORT} (PID ${process.pid})`);
    console.log(`Ruta raíz: ${config.DIRNAME}`);
    console.log(`Puedes acceder desde ${config.BASE_URL}/login`);
  });
} catch (err) {
  console.log((err as Error).message);
}
