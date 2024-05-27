import { NextFunction, Router, Request, Response } from "express";
import mongoose from "mongoose";
import cartModel from "@models/carts.model.js";
import productModel from "@models/products.model.js";

const router = Router();
//const manager = new cartsManager();

// middleware para validar el id
const validateIdCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //Valido si el pid es string y lo parseo con el operador + a number, en caso contrario le asigno 0
  const id = req.params.cid;

  // verifico que el id sea valido para mongoose
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).send({
      status: "ERROR",
      payload: {},
      error: "En id ingresado no corresponde a un carrito válido.",
    });
    return;
  }

  /*
  // verifico si existe el producto con ese id
  const existsId = await manager.isSomeCartWith("id", idNumber);
  if (!existsId) {
    res.status(400).send({
      status: "ERROR",
      payload: {},
      error: `No existe un carrito con el id ${idNumber}.`,
    });
    return;
  }
  */

  next();
};

// middleware para validar el id
const validateIdProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //Valido si el pid es string y lo parseo con el operador + a number, en caso contrario le asigno 0
  const id = req.params.pid;

  // verifico que el id sea valido para mongoose
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).send({
      status: "ERROR",
      payload: {},
      error: "En id ingresado no corresponde a un producto válido.",
    });
    return;
  }

  // verifico si existe el producto con ese id
  const existsId = await productModel.findById(id);
  if (!existsId) {
    res.status(400).send({
      status: "ERROR",
      payload: {},
      error: `No existe un producto con el id ${id}.`,
    });
    return;
  }

  next();
};

router.get("/:cid", validateIdCart, async (req, res) => {
  /*
    La ruta GET /:cid deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.
  */

  const id = req.params.cid;

  const cart = await cartModel
    .findById(id)
    .populate({ path: "products._id", model: "products" })
    .lean();

  if (!cart) {
    res.status(400).send({
      status: "Error",
      payload: cart,
      messagge: "No se encuenta el carrito.",
    });
    return;
  }

  // Mapeo el array de productos para quitar la propiedad _id del objeto product
  const productsArray = cart.products.map((product) => {
    const { _id, ...rest } = product._id;
    return { ...rest, quantity: product.quantity };
  });

  const { products, ...rest } = cart;

  const newCart = { ...rest, products: productsArray };
  res.status(200).send({ status: "OK", payload: newCart });
});

router.post("/", async (req, res) => {
  /*
    La ruta raíz POST / deberá crear un nuevo carrito con la siguiente estructura:
    - Id:Number/String (A tu elección, de igual manera como con los productos, debes asegurar que nunca se dupliquen los ids y que este se autogenere).
    - products: Array que contendrá objetos que representen cada producto
  */

  const products = await productModel.find({}, { _id: 1 }).lean();

  //agrego el campo quantity a cada producto
  const newProducts = products.map((element) => {
    return { ...element, quantity: 0 };
  });
  console.log(newProducts);
  const cart = await cartModel.create({ products: newProducts });

  res.status(200).send({
    status: "OK",
    payload: cart,
    message: "El carrito se ha agregado correctamente.",
  });
});

router.post(
  "/:cid/product/:pid",
  validateIdCart,
  validateIdProduct,
  async (req, res) => {
    /*
    La ruta POST  /:cid/product/:pid deberá agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el siguiente formato:
    - product: SÓLO DEBE CONTENER EL ID DEL PRODUCTO (Es crucial que no agregues el producto completo)
    - quantity: debe contener el número de ejemplares de dicho producto. El producto, de momento, se agregará de uno en uno.
    
    Además, si un producto ya existente intenta agregarse al producto, incrementar el campo quantity de dicho producto. 
  */

    const cartId = req.params.cid;

    const productId = req.params.pid;

    const updatedCart = await cartModel.findOneAndUpdate(
      { _id: cartId, "products._id": productId }, // Filtro para encontrar el carrito y el producto especifico
      {
        $inc: { "products.$.quantity": 1 }, // Incremento la cantidad del producto existente
      },
      {
        new: true, // Devuelvo el documento actualizado
      }
    );

    // Si el producto no estaba en el carrito, agregarlo con cantidad 1
    if (!updatedCart) {
      await cartModel.findOneAndUpdate(
        { _id: cartId },// Filtro para encontrar sólo el carrito
        {
          $push: { products: { _id: productId, quantity: 1 } }, // Inserto el nuevo elemento con cantidad 1
        },
        {
          new: true,
          upsert: true,
        }
      );
    }

    res.status(200).send({
      status: "OK",
      payload: updatedCart,
      message: `Se ha agregado una undidad del producto con el id ${productId} al carrito ${cartId}.`,
    });
  }
);

export default router;
