import { Router } from "express";
import productModel from "@models/products.model.js"
import cartModel from "@models/carts.model.js"
import axios from "axios";
import config from "@/config.js";
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
  try {
    const {data} = await axios.get(`${config.BASE_URL}/?limit=10&sort=1`)
    const {payload} = data

    res.render("products", {...payload});
    
  } catch (err) {
    
  }

});

//se debe hacer un get con axios CORREGIR !!!
router.get("/carts/:cid", async (req, res) => {

  const data = await axios.get(`${config.BASE_URL}/api/carts/${req.params.cid}`)
  res.render("cart", {data});
});

export default router;

