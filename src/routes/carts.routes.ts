import { NextFunction, Router, Request, Response } from "express";
import mongoose from "mongoose";

import config from "@/config.js";
import cartsManager from "@controllers/carts.controller.mdb.js";
import productModel from "@models/products.model.js";

const router = Router();
const manager = new cartsManager();

// middleware para validar el id
const validateIdCart = async (req: Request, res: Response, next: NextFunction) => {
  //Valido si el pid es string y lo parseo con el operador + a number, en caso contrario le asigno 0
  const id = req.params.cid;

  // verifico que el id sea valido para mongoose
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).send({ status: "ERROR", payload: {}, error: "En id ingresado no corresponde a un carrito válido." });
    return;
  }

  /*
  // verifico si existe el producto con ese id
  const existsId = await manager.isSomeCartWith("id", idNumber);
  if (!existsId) {
    res.status(400).send({status: "ERROR",payload: {},error: `No existe un carrito con el id ${idNumber}.`,});
    return;
  }
  */

  next();
};

// middleware para validar el id
const validateIdProduct = async (req: Request, res: Response, next: NextFunction) => {
  //Valido si el pid es string y lo parseo con el operador + a number, en caso contrario le asigno 0
  const id = req.params.pid;

  // verifico que el id sea valido para mongoose
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).send({ status: "ERROR", payload: {}, error: "En id ingresado no corresponde a un producto válido." });
    return;
  }

  // verifico si existe el producto con ese id
  const existsId = await productModel.findById(id);
  if (!existsId) {
    res.status(400).send({ status: "ERROR", payload: {}, error: `No existe un producto con el id ${id}.` });
    return;
  }

  next();
};

router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit;
    const page = req.query.page;
    const products = await manager.getAll(limit, page);
    res.status(200).send({ status: "OK", payload: products });
  } catch (err) {
    res.status(400).send({ status: "Error", payload: {}, message: (err as Error).message });
  }
});

router.get("/one/:cid", validateIdCart, async (req, res) => {
  /*
    La ruta GET /:cid deberá listar los productos que pertenezcan al carrito con el parámetro 
    cid proporcionados.
  */
  try {
    const id = req.params.cid;
    const cart = await manager.getOne(id);

    res.status(200).send({ status: "OK", payload: cart });
  } catch (err) {
    res.status(400).send({ status: "Error", payload: {}, message: (err as Error).message });
  }
});

router.post("/", async (req, res) => {
  /*
    La ruta raíz POST / deberá crear un nuevo carrito con la siguiente estructura:
    - Id:Number/String (A tu elección, de igual manera como con los productos, debes asegurar que nunca se dupliquen los ids y que este se autogenere).
    - products: Array que contendrá objetos que representen cada producto
  */
  try {
    const cart = await manager.create();

    res.status(200).send({ status: "OK", payload: cart, message: "Se ha creado un nuevo carrito con todos los prductos con cantidad 0." });
  } catch (err) {
    res.status(400).send({ status: "Error", payload: {}, message: (err as Error).message });
  }
});

router.post("/:cid/products/:pid", validateIdCart, validateIdProduct, async (req, res) => {
  /*
    La ruta POST  /:cid/product/:pid deberá agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el siguiente formato:
    - product: SÓLO DEBE CONTENER EL ID DEL PRODUCTO (Es crucial que no agregues el producto completo)
    - quantity: debe contener el número de ejemplares de dicho producto. El producto, de momento, se agregará de uno en uno.
    
    Además, si un producto ya existente intenta agregarse al producto, incrementar el campo quantity de dicho producto. 
  */

  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const updatedCart = await manager.add(cartId, productId);

    res.status(200).send({ status: "OK", payload: updatedCart, message: `Se ha agregado una undidad del producto con el id ${productId} al carrito ${cartId}.` });
  } catch (err) {
    res.status(400).send({ status: "Error", payload: {}, message: (err as Error).message });
  }
});

// No implementado
router.put("/:cid", validateIdCart, validateIdProduct, async (req, res) => {
  /*PUT api/carts/:cid deberá actualizar el carrito con un arreglo de productos con el siguiente formato:
  {
	  status:success/error
    payload: Resultado de los productos solicitados
    totalPages: Total de páginas
    prevPage: Página anterior
    nextPage: Página siguiente
    page: Página actual
    hasPrevPage: Indicador para saber si la página previa existe
    hasNextPage: Indicador para saber si la página siguiente existe.
    prevLink: Link directo a la página previa (null si hasPrevPage=false)
    nextLink: Link directo a la página siguiente (null si hasNextPage=false)
  }
  */
});

// No implementado
router.put("/:cid/products/:pid", validateIdCart, validateIdProduct, async (req, res) => {});

router.delete("/:cid", validateIdCart, async (req, res) => {
  try {
    //"DELETE /:cid/products" Vacía el array del carrito cid
    const id = req.params.cid;

    const emptiedCart = await manager.emptyCart(id);
    res.status(200).send({ status: "OK", payload: emptiedCart });
  } catch (err) {
    res.status(400).send({ status: "Error", payload: {}, message: (err as Error).message });
  }
});

router.delete("/:cid/products/:pid", validateIdCart, validateIdProduct, async (req, res) => {
  try {
    //"DELETE /:cid/products/:pid" Quita el producto pid del array del carrito cid
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const deletedProduct = await manager.deleteOneProduct(productId, cartId);

    res.status(200).send({ status: "OK", payload: deletedProduct });
  } catch (err) {
    res.status(400).send({ status: "Error", payload: {}, message: (err as Error).message });
  }
});

//Siempre al último por si no entra a ningún otro endpoint
router.all("*", async (req, res) => {
  res.status(404).send({ origin: config.SERVER, payload: {}, error: "No se encuentra la ruta seleccionada" });
});

export default router;
