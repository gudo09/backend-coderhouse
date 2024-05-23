import { Router } from "express";
import mongoose from "mongoose";
import cartModel from "../dao/models/carts.model.js";
import productModel from "../dao/models/products.model.js";
//import cartsManager from "../dao/managers/cartsManager.js";
//import { manager as productManager } from "./products.routes.js";
const router = Router();
//const manager = new cartsManager();
// middleware para validar el id
const validateIdCart = async (req, res, next) => {
    //Valido si el pid es string y lo parseo con el operador + a number, en caso contrario le asigno 0
    const id = req.params.cid;
    // verifico que el id sea valido para mongoose
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).send({
            status: "ERROR",
            payload: {},
            error: "En id ingresado no es válido.",
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
const validateIdProduct = async (req, res, next) => {
    //Valido si el pid es string y lo parseo con el operador + a number, en caso contrario le asigno 0
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
    // verifico si existe el producto con ese id
    const existsId = await cartModel.findById(id);
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
    const products = await productModel.find().lean();
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
router.post("/:cid/product/:pid", validateIdCart, validateIdProduct, async (req, res) => {
    /*
    La ruta POST  /:cid/product/:pid deberá agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el siguiente formato:
    - product: SÓLO DEBE CONTENER EL ID DEL PRODUCTO (Es crucial que no agregues el producto completo)
    - quantity: debe contener el número de ejemplares de dicho producto. El producto, de momento, se agregará de uno en uno.
    
    Además, si un producto ya existente intenta agregarse al producto, incrementar el campo quantity de dicho producto.
  */
    const cartId = req.params.cid;
    const productId = req.params.pid;
    //await manager.addProductToCart(productId, cartId);
    res.status(200).send({
        status: "OK",
        payload: `Se ha agregado una undidad del producto con el id ${productId} al carrito ${cartId}.`,
    });
});
export default router;
