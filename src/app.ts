import express from "express";
import config from "./config.js";
import productRoutes from "./routes/products.routes.js";
import cartRoutes from "./routes/carts.routes.js";
import viewsRoutes from "./routes/views.routes.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import axios from "axios";

//Creo un a instancia del servidor de express, determino el puerto donde va a iniciar y una instancia del ProductManager
const app = express();

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
app.use("/views", viewsRoutes);

//ruta para archivos estaticos
app.use("/static", express.static(`${config.DIRNAME}/public`));

const httpServer = app.listen(config.PORT, () => {
  console.log(`Servidor iniciado en el puerto ${config.PORT}`);
  console.log(`Ruta raíz: ${config.DIRNAME}`);
});

const socketServer = new Server(httpServer);
app.set("socketServer", socketServer);

// Listener: escucho los eventos de conexion
socketServer.on("connection", (client) => {
  console.log(
    `Cliente conectado! id: ${client.id} desde ${client.handshake.address} `
  );

  // Suscripcion al topico deleteProduct
  client.on("deleteProduct", (data) => {
    const pid = +data;

    axios
      .delete(`${config.BASE_URL}/${pid}`)
      .then((resp) => {
        const okMessage = resp.data.message;
        socketServer.emit("productDeleted", { productId: pid });
        client.emit("okMessage", okMessage);
      })
      .catch((err) => {
        const erorMessage = err.response.data.error;
        client.emit("errorMessage", erorMessage);
      });
  });

  // Suscripcion al topico addProduct
  client.on("addProduct", (data) => {
    console.log(data);

    axios.post(`${config.BASE_URL}/`, data)
  });
});
