import CustomRouter from "../routes/custom.routes.ts";

import axios from "axios";
import config from "../config.ts";
import { Request, Response } from "express";
import { verifyToken } from "@src/services/utils.ts";

export default class ViewsCustomRouter extends CustomRouter {
  init() {
    this.get("/bienvenida", async (req: Request, res: Response) => {
      try {
        const user = { name: "Franco" };
        res.render("index", user);
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.get("/products", async (req: Request, res: Response) => {
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
        res.sendServerError(err as Error);
      }
    });

    this.get("/uploadImages/product", verifyToken("auth"), async (req: Request, res: Response) => {
      try {
        res.render("productImageUploader" )
      } catch (err) {
        res.sendServerError(err as Error);
      }

    })

    this.get("/uploadImages/profile", verifyToken("auth"), async (req: Request, res: Response) => {
      try {
        res.render("profileImageUploader", {uid: req.user?._id} )
      } catch (err) {
        res.sendServerError(err as Error);
      }

    })

    this.get("/uploadImages/document", verifyToken("auth"), async (req: Request, res: Response) => {
      try {
        res.render("premiumRequestDocumentUploader", {uid: req.user?._id} )
      } catch (err) {
        res.sendServerError(err as Error);
      }

    })

    this.get("/carts/:cid", async (req: Request, res: Response) => {
      try {
        const { data } = await axios.get(`${config.BASE_URL}/api/carts/one/${req.params.cid}`);
        const { payload } = data;
        res.render("cart", { ...payload });
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.get("/register", async (req: Request, res: Response) => {
      try {
        res.render("register", { showError: req.query.error ? true : false, errorMessage: req.query.error });
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.get("/login", async (req: Request, res: Response) => {
      try {
        if (req.user) return res.redirect("/profile");
        res.render("login", { showError: req.query.error ? true : false, errorMessage: req.query.error });
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.get("/profile", async (req: Request, res: Response) => {
      try {
        if (!req.session.user) return res.redirect("/login");
        res.render("profile", { user: req.session.user });
        req.logger.debug(`${new Date().toString()} El usuario ${req.user?.firstName} ${req.user?.lastName} inició sesión ${req.method} ${req.url}`);
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.get("/current", async (req: Request, res: Response) => {
      try {
        if (!req.session.user) res.sendUserError(new Error("Actualmente no hay usuario loggeado"));

        const currentUserFirstName = req.session.user.firstName;
        const currentUserLastName = req.session.user.lastName;
        res.sendSuccess(`El usuario actualmente autenticado es ${currentUserFirstName} ${currentUserLastName}`);
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });
  }
}
