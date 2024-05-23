import { Router } from "express";
//import ProductManager from "../dao/managers/productManager.js";
import productModel from "../dao/models/products.model.js";
import mongoose from "mongoose";
const router = Router();
//export const manager = new ProductManager();
// middleware para validar el id
const validateId = async (req, res, next) => {
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
const validateBody = async (req, res, next) => {
    //valido todos los campor requeridos en el body
    req.body.status = true;
    const { id, title, price, description, code, status, stock, category } = req.body;
    if (id) {
        res.status(400).json({
            status: "ERROR",
            payload: {},
            error: "No se debe enviar el id.",
        });
        return;
    }
    if (!title ||
        !price ||
        !description ||
        !code ||
        !status ||
        !stock ||
        !category) {
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
    //Valido si el limite es string y lo parseo con el operador + a number, en caso contrario le asigno 0
    const limit = req.query.limit;
    const limitNumber = typeof limit === "string" ? +limit : 0;
    const products = await productModel.find().limit(limitNumber).lean();
    res.status(200).send({ status: "OK", payload: products });
});
router.post("/", validateBody, async (req, res) => {
    /*
      La ruta raíz POST / deberá agregar un nuevo producto con los campos:
      - id: Number/String (A tu elección, el id NO se manda desde body, se autogenera como lo hemos visto desde los primeros entregables, asegurando que NUNCA se repetirán los ids en el archivo.
      - title:String,
      - description:String
      - code:String
      - price:Number
      - status:Boolean
      - stock:Number
      - category:String
      - thumbnails:Array de Strings que contenga las rutas donde están almacenadas las imágenes referentes a dicho producto
      Status es true por defecto.
      Todos los campos son obligatorios, a excepción de thumbnails
    */
    const body = req.body;
    // valido si el código del producto a agregar está repetido
    const isDuplicateCode = await productModel.exists({ code: body.code });
    // verifico que el codigo a agregar ya existe
    if (isDuplicateCode) {
        res.status(400).send({
            status: "ERROR",
            payload: {},
            error: "El código del elemento que se intenta agregar está duplicado.",
        });
        return;
    }
    // procedo con el alta del producto
    const lastProductAdded = await productModel.create(body);
    res.status(200).send({
        status: "OK",
        payload: lastProductAdded,
        message: "Se ha agregado un nuevo producto.",
    });
});
router.get("/:pid", validateId, async (req, res) => {
    const id = req.params.pid;
    const product = await productModel.findById(id);
    if (product === null) {
        res.status(400).send({
            status: "Error",
            payload: {},
            message: "No se ha encontrado el producto.",
        });
        return;
    }
    res.status(200).send({ status: "OK", payload: product });
});
router.put("/:pid", validateId, async (req, res) => {
    /*
    La ruta PUT /:pid deberá tomar un producto y actualizarlo por los campos enviados
    desde body. NUNCA se debe actualizar o eliminar el id al momento de hacer dicha
    actualización.
    */
    const id = req.params.pid;
    const code = req.body.code;
    const body = req.body;
    //valido que el codigo nuevo no sea repetido con el de otro producto
    const productToUpdate = await productModel.findById(id);
    const productWithCode = await productModel.find({ code: code });
    let duplicateCode = false;
    productWithCode.forEach(product => {
        if (productToUpdate !== product) {
            duplicateCode = true;
        }
    });
    if (duplicateCode) {
        res.status(400).send({
            status: "Error",
            message: `Ya existe otro producto con ese código. No se pudo actualizar.`,
        });
        return;
    }
    // procedo con la actualización del producto
    const updatedProduct = await productModel.findByIdAndUpdate(id, body, {
        new: true,
    });
    res.status(200).send({
        status: "OK",
        message: `Se ha modificado el producto con el id ${id}`,
        payload: updatedProduct,
    });
});
router.delete("/:pid", validateId, async (req, res) => {
    /*
      La ruta DELETE /:pid deberá eliminar el producto con el pid indicado.
    */
    const id = req.params.pid;
    const product = await productModel.findById(id);
    if (product === null) {
        res.status(400).send({
            status: "Error",
            payload: {},
            message: "No se ha encontrado el producto para eliminar.",
        });
        return;
    }
    // procedo con la eliminación del producto
    const productDeleted = await productModel.findByIdAndDelete(id);
    res.status(200).send({
        status: "OK",
        payload: productDeleted,
        message: "Producto eliminado.",
    });
});
export default router;
