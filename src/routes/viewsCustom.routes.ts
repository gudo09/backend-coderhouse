import CustomRouter from "../routes/custom.routes.ts";
import axios from "axios";
import config from "../config.ts";
import { Request, Response } from "express";
import { verifyToken } from "@src/services/utils.ts";

export default class ViewsCustomRouter extends CustomRouter {
  init() {
    this.get("/", async (req: Request, res: Response) => {
      try {
        // Obtengo los datos de la consulta con axios
        const { data } = await axios.get(`${config.BASE_URL}/api/products`);
        const { payload } = data;

        res.render("pages/index", payload);
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.get("/register", async (req: Request, res: Response) => {
      try {
        res.render("pages/register", { showError: req.query.error ? true : false, errorMessage: req.query.error });
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.get("/login", verifyToken("auth"), async (req: Request, res: Response) => {
      try {
        res.render("pages/login", {
          showError: req.query.error ? true : false,
          errorMessage: req.query.error,
        });
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.get("/profile", verifyToken("auth"), async (req: Request, res: Response) => {
      try {
        if (!req.user) return res.redirect("/login");
        res.render("pages/profile", { user: req.user });
        req.logger.debug(`${new Date().toString()} El usuario ${req.user?.firstName} ${req.user?.lastName} inició sesión ${req.method} ${req.url}`);
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.get("/products", async (req: Request, res: Response) => {
      try {
        console.log(req.cookies[config.COOKIE_NAME]);
        // Valores por defecto
        const { limit = 10, sort = 1, query, page = 1 }: { limit?: number; sort?: number; query?: Record<string, any>; page?: number } = req.query;

        // Armo el query params con todos los datos enviados en la url
        const queryParams = new URLSearchParams({ limit: limit.toString(), sort: sort.toString(), page: page.toString(), access_token: req.cookies[config.COOKIE_NAME] });

        // Si query no es undefined, lo agrego (para evitar errores)
        const queryParam = query ? `&query=${query}` : "";

        console.log(`${config.BASE_URL}/api/products?${queryParams.toString()}${queryParam}`);

        // Obtengo los datos de la consulta con axios
        const { data } = await axios.get(`${config.BASE_URL}/api/products?${queryParams.toString()}${queryParam}`);
        const { payload } = data;

        // Renderizo la vista
        res.render("pages/products", payload);
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    // FIXME: Falta implemtar - debería mostrar todos los productos que sean de un vendedor
    this.get("/products/:uid", verifyToken("auth"), async (req: Request, res: Response) => {});

    this.get("/carts/:cid", verifyToken("auth"), async (req: Request, res: Response) => {
      try {
        const { data } = await axios.get(`${config.BASE_URL}/api/carts/one/${req.params.cid}`);
        const { payload } = data;
        res.render("pages/cart", { ...payload });
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.get("/uploadImages/profile", verifyToken("auth"), async (req: Request, res: Response) => {
      try {
        res.render("pages/profileImageUploader", { uid: req.user?._id });
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.get("/uploadImages/product", verifyToken("auth"), async (req: Request, res: Response) => {
      try {
        res.render("pages/productImageUploader");
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.get("/uploadImages/document", verifyToken("auth"), async (req: Request, res: Response) => {
      try {
        res.render("pages/premiumRequestDocumentUploader", { uid: req.user?._id });
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

  }
}
