import CustomRouter from "@routes/custom.routes.js";

import axios from "axios";
import config from "@/config.js";
import productModel from "@models/products.model.js";
import { verifyToken } from "@services/utils.js";

export default class ViewsCustomRouter extends CustomRouter {
  init() {
    this.get("/bienvenida", async (req, res) => {
      try {
        const user = { name: "Franco" };
        res.render("index", user);
      } catch (err) {
        res.sendServerError?.(err as Error);
      }
    });

    this.get("/home", async (req, res) => {
      try {
        const products = await productModel.find().lean();
        res.render("home", { products });
      } catch (err) {
        res.sendServerError?.(err as Error);
      }
    });

    // debería poder hacerse sin usar axios
    this.get("/products", async (req, res) => {
      try {
        // Valores por defecto
        const { limit = 10, sort = 1, query, page = 1 }: { limit?: number; sort?: number; query?: Record<string, any>; page?: number } = req.query;

        // Armo el query params con todos los datos enviados en la url
        const queryParams = new URLSearchParams({ limit: limit.toString(), sort: sort.toString(), page: page.toString() });

        // Si query no es undefined, lo agrego (para evitar errores)
        const queryParam = query ? `&query=${query}` : "";

        // Obtengo los datos de la consulta con axios
        const { data } = await axios.get(`${config.BASE_URL}/api/products?${queryParams.toString()}${queryParam}`);
        const { payload } = data;

        // Renderizo la vista
        res.render("products", { ...payload });
      } catch (err) {
        res.sendServerError?.(err as Error);
      }
    });

    // debería poder hacerse sin usar axios
    this.get("/carts/:cid", async (req, res) => {
      try {
        const { data } = await axios.get(`${config.BASE_URL}/api/carts/one/${req.params.cid}`);
        const { payload } = data;
        res.render("cart", { ...payload });
      } catch (err) {
        res.sendServerError?.(err as Error);
      }
    });

    this.get("/register", async (req, res) => {
      try {
        res.render("register", { showError: req.query.error ? true : false, errorMessage: req.query.error });
      } catch (err) {
        res.sendServerError?.(err as Error);
      }
    });

    this.get("/login", async (req, res) => {
      try {
        if (req.session.user) return res.redirect("/profile");
        res.render("login", { showError: req.query.error ? true : false, errorMessage: req.query.error });
      } catch (err) {
        res.sendServerError?.(err as Error);
      }
    });

    this.get("/profile", async (req, res) => {
      try {
        if (!req.session.user) return res.redirect("/login");
        res.render("profile", { user: req.session.user });
      } catch (err) {
        res.sendServerError?.(err as Error);
      }
    });
  }
}
