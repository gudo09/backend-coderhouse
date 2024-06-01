import { Router } from "express";
import productModel from "@models/products.model.js"
import cartModel from "@models/carts.model.js"
const router = Router();


router.get("/bienvenida", async (req, res) => {
  const user = { name: "Franco" };
  res.render("index", user);
});

router.get("/home", async (req, res) => {
  const products = await productModel.find().lean();
  res.render("home", {products});
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await productModel.find().lean();
  res.render("realtimeproducts", {products});
});

//se debe hacer un get con axios CORREGIR !!!
router.get("/products", async (req, res) => {
  const products = await productModel.find().lean();
  res.render("products", {products});
});

//se debe hacer un get con axios CORREGIR !!!
router.get("/carts/:cid", async (req, res) => {
  const products = await cartModel.findById(req.params.cid).lean();
  res.render("cart", {products});
});

export default router;

