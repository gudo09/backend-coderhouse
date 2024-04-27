import express from "express";
import config from "./config.js";
import productRoutes from "./routes/products.routes.js";
import cartRoutes from "./routes/carts.routes.js";
import viewsRoutes from "./routes/views.routes.js";
import handlebars from "express-handlebars";

//Creo un a instancia del servidor de express, determino el puerto donde va a iniciar y una instancia del ProductManager
const app = express();

//configuraciones de express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// configuraciones Handlebars
app.engine("handlebars", handlebars.engine());
app.set( "views", `${config.DIRNAME}/views`)
app.set('view engine', 'handlebars');

// hago uso de las rutas
app.use("/", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/views", viewsRoutes);

//ruta para archivos estaticos
app.use("/static", express.static(`${config.DIRNAME}/public`));

app.listen(config.PORT, () => {
  console.log(`Servidor iniciado en el puerto ${config.PORT}`);
  console.log(`Ruta raíz: ${config.DIRNAME}`);
});
