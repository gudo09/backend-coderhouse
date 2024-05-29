import { NextFunction, Router, Request, Response } from "express";
import productModel from "@models/products.model.js";
import mongoose from "mongoose";
import productsManager from "@managers/productsManager.mdb.js";

const router = Router();
const manager = new productsManager();

// middleware para validar el id
const validateId = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.pid;

  // verifico que el id sea valido para mongoose
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).send({
      status: "ERROR",
      payload: {},
      error: "En id ingresado no es válido.",
    });
    return;
  }

  next();
};
// middleware para validar el los campos del body
const validateBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //valido todos los campor requeridos en el body
  req.body.status = true;
  const { id, title, price, description, code, status, stock, category } =
    req.body;

  if (id) {
    res.status(400).json({
      status: "ERROR",
      payload: {},
      error: "No se debe enviar el id.",
    });
    return;
  }

  if (
    !title ||
    !price ||
    !description ||
    !code ||
    !status ||
    !stock ||
    !category
  ) {
    res.status(400).json({
      status: "ERROR",
      payload: {},
      error: "Faltan datos en el cuerpo de la solicitud",
    });
    return;
  }

  next();
};
// el callback es async porque espera las respuestas de mongoose
router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit;
    const sort = req.query.sort;
    const page = req.query.page;
    const query = req.query.query;
    const products = await manager.getAll(limit, sort, query, page);
    res.status(200).send({ status: "OK", payload: products });
  } catch (error) {
    res.status(400).send({ status: "OK", payload: {}, error: error });
  }
});

router.post("/", validateBody, async (req, res) => {
  try {
    const body = req.body;
    const productAdded = await manager.add(body);
    res.status(200).send({
      status: "OK",
      payload: productAdded,
      message: "Se ha agregado un nuevo producto.",
    });
  } catch (err) {
    res.status(400).send({
      status: "OK",
      payload: {},
      message: (err as Error).message,
    });
  }
});

router.get("/:pid", validateId, async (req, res) => {
  try {
    const id = req.params.pid;
    const product = await manager.getById(id);
    res.status(200).send({ status: "OK", payload: product });
  } catch (error) {
    res.status(400).send({
      status: "Error",
      payload: {},
      message: (error as Error).message,
    });
  }
});

router.put("/:pid", validateId, async (req, res) => {
  try {
    const id = req.params.pid;

    const body = req.body;

    const updatedProduct = await manager.update(id, body);

    res.status(200).send({
      status: "OK",
      message: `Se ha modificado el producto con el id ${id}`,
      payload: updatedProduct,
    });
  } catch (error) {
    res.status(400).send({
      status: "Error",
      payload: {},
      message: (error as Error).message,
    });
  }
});

router.delete("/:pid", validateId, async (req, res) => {
  try {
    const id = req.params.pid;

    const productDeleted = await manager.delete(id);
    res.status(200).send({
      status: "OK",
      payload: productDeleted,
      message: "Producto eliminado.",
    });
  } catch (error) {
    res.status(400).send({
      status: "Error",
      payload: {},
      message: (error as Error).message,
    });
  }
});

export default router;
