import { NextFunction, Router, Request, Response } from "express";
import ProductManager from "../productManager.js";

const router = Router();
export const manager = new ProductManager();

// middleware para validar el id
const validateId = async (req: Request, res: Response, next: NextFunction) => {
  //Valido si el pid es string y lo parseo con el operador + a number, en caso contrario le asigno 0
  const id = req.params.pid;
  const idNumber: number = typeof id === "string" ? +id : 0;

  // verifico que el id sea positivo y mayor que 0
  if (idNumber <= 0 || isNaN(idNumber)) {
    res.status(400).send({
      status: "ERROR",
      payload: {},
      error: "Se requiere un valor positivo y mayor que 0 en el id.",
    });
    return;
  }

  // verifico si existe el producto con ese id
  const existsId = await manager.isSomeProductWith("id", idNumber);
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
    res
      .status(400)
      .json({
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
    res
      .status(400)
      .json({
        status: "ERROR",
        payload: {},
        error: "Faltan datos en el cuerpo de la solicitud",
      });
    return;
  }

  next();
};
// el callback es async porque ejecuta metodos asincronos del product manager
router.get("/", async (req, res) => {
  //Valido si el limite es string y lo parseo con el operador + a number, en caso contrario le asigno 0
  const limit = req.query.limit;
  const limitNumber: number = typeof limit === "string" ? +limit : 0;
  const products = await manager.getProducts(limitNumber);
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
  const isDuplicateCode = await manager.isSomeProductWith("code", body.code);

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
  await manager.addProduct(body);
  res.status(200).send({
    status: "OK",
    payload: "El producto se ha agregado correctamente.",
  });
});

router.get("/:pid", validateId, async (req, res) => {
  const id = +req.params.pid;

  const product = await manager.getProductById(id);
  res.status(200).send({ status: "OK", payload: product });
});

router.put("/:pid", validateId, async (req, res) => {
  /*
  La ruta PUT /:pid deberá tomar un producto y actualizarlo por los campos enviados
  desde body. NUNCA se debe actualizar o eliminar el id al momento de hacer dicha 
  actualización.
  */
  const id = +req.params.pid;

  // procedo con la actualización del producto
  const body = req.body;
  const updatedProduct = await manager.updateProduct(id, body);
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
  const id = +req.params.pid;

  // procedo con la eliminación del producto
  const message = await manager.deteleProduct(id);
  res.status(200).send({ status: "OK", payload: {}, message: message });
});

export default router;
