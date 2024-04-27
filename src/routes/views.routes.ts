import ProductManager from "../productManager.js";
import { Router } from "express";

const productManager = new ProductManager();
const router = Router();

router.get("/bienvenida", async (req, res) => {
  const user = { name: "Franco" };
  res.render("index", user);
});

router.get("/home", async (req, res) => {
  const products = await productManager.getProducts(0);
  console.log(products)
  res.render("home", {products});
});

export default router;
