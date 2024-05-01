import { manager as productManager } from "./products.routes.js";
import { Router } from "express";

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

router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts(0);
  res.render("realtimeproducts", {products});
});

export default router;

