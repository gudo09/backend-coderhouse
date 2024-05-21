//import { manager as productManager } from "./products.routes.js";
import { Router } from "express";
import productModel from "../dao/models/products.model.js";
const router = Router();
router.get("/bienvenida", async (req, res) => {
    const user = { name: "Franco" };
    res.render("index", user);
});
router.get("/home", async (req, res) => {
    const products = await productModel.find().lean();
    res.render("home", { products });
});
router.get("/realtimeproducts", async (req, res) => {
    const products = await productModel.find().lean();
    res.render("realtimeproducts", { products });
});
export default router;
