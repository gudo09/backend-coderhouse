import CustomRouter from "@routes/custom.routes.js";
import ProductsController from "@controllers/products.controller.mdb.js";
import config from "@/config.js";
import { validateBody, verifyToken, handlePolicies } from "@services/utils.js";

const controller = new ProductsController();

export default class ProductsCustomRouter extends CustomRouter {
  init() {
    this.router.param("pid", async (req, res, next, pid) => {
      if (!config.MONGODB_ID_REGEX.test(pid)) {
        return res.sendServerError(new Error("Id no válido"));
      }

      next();
    });

    // el callback es async porque espera las respuestas de mongoose
    this.get("/", verifyToken, async (req, res) => {
      try {
        const limit = req.query.limit;
        const sort = req.query.sort;
        const page = req.query.page;
        const query = req.query.query;

        const products = await controller.getAll(limit, sort, query, page);

        res.sendSuccess(products);
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.post("/", verifyToken, validateBody, handlePolicies(["admin"]), async (req, res) => {
      try {
        const body = req.body;
        const productAdded = await controller.add(body);
        res.sendSuccess({ productAdded: productAdded, message: "Se ha agregado un nuevo producto." });
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.get("/:pid", verifyToken, async (req, res) => {
      try {
        const id = req.params.pid;
        const product = await controller.getById(id);
        res.sendSuccess(product);
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.put("/:pid", verifyToken, handlePolicies(["admin"]), async (req, res) => {
      try {
        const id = req.params.pid;
        const body = req.body;
        const updatedProduct = await controller.update(id, body);

        res.sendSuccess(updatedProduct);
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.delete("/:pid", verifyToken, handlePolicies(["admin"]), async (req, res) => {
      try {
        const id = req.params.pid;
        const productDeleted = await controller.delete(id);

        res.sendSuccess(productDeleted);
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    //Siempre al último por si no entra a ningún otro endpoint
    this.router.all("*", async (req, res) => {
      res.sendServerError(new Error("No se encuentra la ruta seleccionada"));
    });
  }
}
