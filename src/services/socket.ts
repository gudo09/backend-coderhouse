import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import axios from "axios";
import config from "../config.ts";
//import { createAdapter } from "@socket.io/cluster-adapter";

const initSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer);
  /* 
// Uso el adaptador para cluster
  io.adapter(createAdapter());
*/

  // Listener: escucho los eventos de conexion
  io.on("connection", (client) => {
    console.log(`Cliente conectado! id: ${client.id} desde ${client.handshake.address} (PID: ${process.pid})`);

    // Suscripcion al topico deleteProduct
    client.on("deleteProduct", (data) => {
      const pid = data;
      axios
        .delete(`${config.BASE_URL}/api/products/${pid}`)
        .then((resp) => {
          const okMessage = resp.data.message;
          io.emit("productDeleted", { productId: pid });
          client.emit("DeleteProduct_OkMessage", okMessage);
        })
        .catch((err) => {
          const erorMessage = err.response.data.error;
          client.emit("DeleteProduct_ErrorMessage", erorMessage);
        });
    });

    // Suscripcion al topico addProduct
    client.on("addProduct", (data) => {
      axios
        .post(`${config.BASE_URL}/`, data)
        .then((resp) => {
          const okMessage = resp.data.message;
          const lastProductAdded = resp.data.payload;
          io.emit("productAdded", lastProductAdded);
          client.emit("AddProduct_OkMessage", okMessage);
        })
        .catch((err) => {
          const erorMessage = err.response.data.error;
          client.emit("AddProduct_ErrorMessage", erorMessage);
        });
    });
  });
};

export default initSocket;
