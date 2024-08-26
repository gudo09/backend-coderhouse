import { Request, Response, NextFunction } from "express";

import CustomRouter from "../routes/custom.routes.ts";
import ProductsController from "../controllers/products.controller.mdb.ts";
import config from "../config.ts";
import { validateBody, verifyToken, handlePolicies } from "../services/utils.ts";
import { faker } from "@faker-js/faker";

const controller = new ProductsController();

export default class ProductsCustomRouter extends CustomRouter {
  init() {
    this.router.param("pid", async (req: Request, res: Response, next: NextFunction, pid) => {
      if (!config.MONGODB_ID_REGEX.test(pid)) {
        return res.sendServerError(new Error("Id no válido"));
      }

      next();
    });

    this.get("/all/:limit?", async (req: Request, res) => {
      try {
        const limit = + req.params.limit || 0;

        const products = await controller.getAll(limit);

        res.sendSuccess(products);
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    // el callback es async porque espera las respuestas de mongoose
    this.get("/", verifyToken("auth"), async (req: Request, res: Response) => {
      try {
        const limit = req.query.limit;
        const sort = req.query.sort;
        const page = req.query.page;
        const query = req.query.query;

        const products = await controller.getPaginated(limit, sort, query, page);

        res.sendSuccess(products);
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    // genera datos mock para products
    this.get("/fakeProducts/:qty?", async (req: Request, res: Response) => {
      try {
        const quantity = +req.params.qty || 100;
        const CATEGORIES = ["category1", "category2", "category3", "category4"];
        const data = [];

        for (let i = 0; i < quantity; i++) {
          const title = faker.commerce.productName();
          const description = faker.commerce.productDescription();
          const price: number = +faker.commerce.price();
          const thumbnails = [];
          const thumbnailsQty: number = +faker.number.int({ min: 1, max: 4 });
          const code = faker.database.mongodbObjectId();
          const stock: number = +faker.number.int({ min: 0, max: 200 });
          const status: boolean = faker.datatype.boolean();
          const category = CATEGORIES[+faker.number.int({ max: CATEGORIES.length })];

          for (let j = 0; j < thumbnailsQty; j++) {
            const element = faker.image.url({ width: 320, height: 240 });
            thumbnails.push(element);
          }

          data.push({ title, description, price, thumbnails, code, stock, status, category });
        }

        res.sendSuccess(data);
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.post("/", verifyToken("auth"), validateBody, handlePolicies(["admin, premium"]), async (req: Request, res: Response) => {
      try {
        const body = req.body;
        const productAdded = await controller.add(body);
        res.sendSuccess({ productAdded: productAdded, message: "Se ha agregado un nuevo producto." });
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.get("/:pid", verifyToken("auth"), async (req: Request, res: Response) => {
      try {
        const id = req.params.pid;
        const product = await controller.getById(id);
        res.sendSuccess(product);
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.put("/:pid", verifyToken("auth"), handlePolicies(["admin"]), async (req: Request, res: Response) => {
      try {
        const id = req.params.pid;
        const body = req.body;
        const updatedProduct = await controller.update(id, body);

        res.sendSuccess(updatedProduct);
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.delete("/:pid", verifyToken("auth"), handlePolicies(["admin"]), async (req: Request, res: Response) => {
      try {
        const id = req.params.pid;
        const productDeleted = await controller.delete(id);

        res.sendSuccess(productDeleted);
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

  }
}
