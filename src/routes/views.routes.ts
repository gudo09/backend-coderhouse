import { Router } from "express";
import productModel from "@models/products.model.js";
import cartModel from "@models/carts.model.js";
import ProductManager from "@managers/productsManager.mdb.js";
import axios from "axios";
import config from "@/config.js";

const router = Router();
const productManager = new ProductManager();

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

router.get("/products", async (req, res) => {
  try {
    // Valores por defecto
    const { limit = 10, sort = 1, query, page = 1 }: { limit?: number; sort?: number; query?: Record<string, any>; page?: number } = req.query;

    // Armo el query params con todos los datos enviados en la url
    const queryParams = new URLSearchParams({ limit: limit.toString(), sort: sort.toString(), page: page.toString() });

    // Si query no es undefined, lo agrego (para evitar errores)
    const queryParam = query ? `&query=${query}` : "";

    //console.log(`${config.BASE_URL}/?${queryParams.toString()}`)

    // Obtengo los datos de la consulta con axios
    const { data } = await axios.get(`${config.BASE_URL}/api/products?${queryParams.toString()}${queryParam}`);
    const { payload } = data;

    // Renderizo la vista
    res.render("products", { ...payload });
  } catch (err) {
    res.status(400).send((err as Error).message);
    console.log(err);
  }

  /*
  try {
    const {data} = await axios.get(`${config.BASE_URL}`)
    const {payload} = data
 
    res.render("products", {...payload});
    
  } catch (err) {
    res.status(400).send((err as Error).message);
  }
  
  */
});

router.get("/carts/:cid", async (req, res) => {
  const { data } = await axios.get(`${config.BASE_URL}/api/carts/one/${req.params.cid}`);
  const { payload } = data;
  console.log(payload);
  res.render("cart", { ...payload });
});

router.get("/register", async (req, res) => {
  res.render("register", {});
});

router.get("/login", async (req, res) => {
  if (req.session.user) return res.redirect("/profile");
  res.render("login", { showError: req.query.error ? true : false, errorMessage: req.query.error });
});

router.get("/profile", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.render("profile", { user: req.session.user });
});

export default router;
