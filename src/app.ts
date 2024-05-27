import express from "express";
import mongoose from "mongoose"
import config from "./config.js";
import productRoutes from "./routes/products.routes.js";
import cartRoutes from "./routes/carts.routes.js";
import viewsRoutes from "./routes/views.routes.js";
import handlebars from "express-handlebars";
import initSocket from "./socket.js";

//Creo un a instancia del servidor de express, determino el puerto donde va a iniciar y una instancia del ProductManager
const app = express();

app.use("/views", viewsRoutes);

//ruta para archivos estaticos
app.use("/static", express.static(`${config.DIRNAME}/public`));

const expressInstance = app.listen(config.PORT, async () => {
  // conecto mongoose con la base de datos en Atlas
  await mongoose.connect(config.MONGOBD_URI);

  //inicializo el server de socket.io desde el archivo socket.js
  const socketServer = initSocket(expressInstance);
  app.set("socketServer", socketServer);

  //configuraciones de express
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // configuraciones Handlebars
  app.engine("handlebars", handlebars.engine());
  app.set("views", `${config.DIRNAME}/views`);
  app.set("view engine", "handlebars");

  // hago uso de las rutas
  app.use("/", productRoutes);
  app.use("/api/carts", cartRoutes);

  console.log(`Servidor iniciado en el puerto ${config.PORT}`);
  console.log(`Ruta raíz: ${config.DIRNAME}`);
  console.log(
    `Puedes acceder desde http://localhost:${config.PORT}/views/realtimeproducts`
  );
});
