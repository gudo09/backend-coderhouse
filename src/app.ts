import express from "express";
import config from "./config.js";
import productRoutes from "./routes/products.routes.js";
import cartRoutes from "./routes/carts.routes.js";

//Creo un a instancia del servidor de express, determino el puerto donde va a iniciar y una instancia del ProductManager
const app = express();
const PORT = config.PORT;

//configuraciones de express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// hago uso de las rutas
app.use("/", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/static", express.static(`${config.DIRNAME}/public`));

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
  console.log(`Ruta raíz: ${config.DIRNAME}`);
});
