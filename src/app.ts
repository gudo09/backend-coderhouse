import ProductManager from "./productManager.js";
import express from "express";

//Creo un a instancia del servidor de express, determino el puerto donde va a iniciar y una instancia del ProductManager
const app = express();
const PORT = 8080;
const manager = new ProductManager();

//configuraciones de express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// el callback es async porque ejecuta metodos asincronos del product manager
app.get("/", async (req, res) => {
  //Valido si el limite es string y lo parseo con el operador + a number, en caso contrario le asigno 0
  const limit = req.query.limit;
  const limitNumber: number = typeof limit === "string" ? +limit : 0;
  const products = await manager.getProducts(limitNumber);
  res.status(200).send({ status: "OK", payload: products });
});

app.get("/:pid", async (req, res) => {
  //Valido si el pid es string y lo parseo con el operador + a number, en caso contrario le asigno 0
  const id = req.params.pid;
  const idNumber: number = typeof id === "string" ? +id : 0;
  const product = await manager.getProductById(idNumber);
  res.status(200).send({ status: "OK", payload: product });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});

//test metodo post
app.post("/", (req, res) => {
  const body = req.body;
  res.status(200).send({ status: "OK", payload: body });
});
