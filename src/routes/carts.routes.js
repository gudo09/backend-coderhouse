import { Router } from "express";
import cartsManager from "../dao/managers/cartsManager.js";
import { manager as productManager } from "./products.routes.js";
const router = Router();
const manager = new cartsManager();
// middleware para validar el id
const validateIdCart = async (req, res, next) => {
    //Valido si el pid es string y lo parseo con el operador + a number, en caso contrario le asigno 0
    const id = req.params.cid;
    const idNumber = typeof id === "string" ? +id : 0;
    // verifico que el id sea positivo y mayor que 0
    if (idNumber <= 0 || isNaN(idNumber)) {
        res.status(400).send({
            status: "ERROR",
            payload: {},
            error: "Se requiere un valor positivo y mayor que 0 en el id del carrito.",
        });
        return;
    }
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
    next();
};
// middleware para validar el id
const validateIdProduct = async (req, res, next) => {
    //Valido si el pid es string y lo parseo con el operador + a number, en caso contrario le asigno 0
    const id = req.params.pid;
    const idNumber = typeof id === "string" ? +id : 0;
    // verifico que el id sea positivo y mayor que 0
    if (idNumber <= 0 || isNaN(idNumber)) {
        res.status(400).send({
            status: "ERROR",
            payload: {},
            error: "Se requiere un valor positivo y mayor que 0 en el id del producto.",
        });
        return;
    }
    // verifico si existe el producto con ese id
    const existsId = await productManager.isSomeProductWith("id", idNumber);
    if (!existsId) {
        res.status(400).send({
            status: "ERROR",
            payload: {},
            error: `No existe un producto con el id ${idNumber}.`,
        });
        return;
    }
    next();
};
router.get("/:cid", validateIdCart, async (req, res) => {
    /*
      La ruta GET /:cid deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.
    */
    const id = +req.params.cid;
    const cart = await manager.getCartById(id);
    res.status(200).send({ status: "OK", payload: cart });
});
router.post("/", async (req, res) => {
    /*
      La ruta raíz POST / deberá crear un nuevo carrito con la siguiente estructura:
      - Id:Number/String (A tu elección, de igual manera como con los productos, debes asegurar que nunca se dupliquen los ids y que este se autogenere).
      - products: Array que contendrá objetos que representen cada producto
    */
    const products = await productManager.getProducts(0);
    await manager.addCart({ products: products });
    res.status(200).send({
        status: "OK",
        payload: "El carrito se ha agregado correctamente.",
    });
});
router.post("/:cid/product/:pid", validateIdCart, validateIdProduct, async (req, res) => {
    /*
    La ruta POST  /:cid/product/:pid deberá agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el siguiente formato:
    - product: SÓLO DEBE CONTENER EL ID DEL PRODUCTO (Es crucial que no agregues el producto completo)
    - quantity: debe contener el número de ejemplares de dicho producto. El producto, de momento, se agregará de uno en uno.
    
    Además, si un producto ya existente intenta agregarse al producto, incrementar el campo quantity de dicho producto.
  */
    const cartId = +req.params.cid;
    const productId = +req.params.pid;
    await manager.addProductToCart(productId, cartId);
    res.status(200).send({
        status: "OK",
        payload: `Se ha agregado una undidad del producto con el id ${productId} al carrito ${cartId}.`,
    });
});
export default router;
