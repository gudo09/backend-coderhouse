import mongoose from "mongoose";
import CustomRouter from "./custom.routes.js";
import CartsController from "@controllers/carts.controller.mdb.js";
import ProductsController from "@controllers/products.controller.mdb.js";
import { handlePolicies } from "@/services/utils.js";

const controller = new CartsController();
const productsController = new ProductsController();

export default class CartsCustomRouter extends CustomRouter {
  init() {
    // Uso param para validar el id del cart
    this.router.param("cid", async (req, res, next, cid) => {
      //Valido si el pid es string y lo parseo con el operador + a number, en caso contrario le asigno 0
      const id = cid;

      // verifico que el id sea valido para mongoose
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.sendServerError(new Error("En id ingresado no corresponde a un carrito válido."));
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
    });

    // Uso param para validar el id del producto
    this.router.param("pid", async (req, res, next, pid) => {
      //Valido si el pid es string y lo parseo con el operador + a number, en caso contrario le asigno 0
      const id = pid;

      // verifico que el id sea valido para mongoose
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.sendServerError(new Error("En id ingresado no corresponde a un producto válido."));
      }

      // verifico si existe el producto con ese id
      const existsId = await productsController.getById(id);
      if (!existsId) {
        res.sendServerError(new Error(`No existe un producto con el id ${id}.`));
      }

      next();
    });

    this.get("/", async (req, res) => {
      try {
        const limit = req.query.limit;
        const page = req.query.page;
        const products = await controller.getAll(limit, page);
        res.sendSuccess(products);
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.get("/one/:cid", async (req, res) => {
      /*
        La ruta GET /:cid deberá listar los productos que pertenezcan al carrito con el parámetro 
        cid proporcionados.
      */
      try {
        const id = req.params.cid;
        const cart = await controller.getOne(id);
        res.sendSuccess(cart);
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.post("/", async (req, res) => {
      /*
        La ruta raíz POST / deberá crear un nuevo carrito con la siguiente estructura:
        - Id:Number/String (A tu elección, de igual manera como con los productos, debes asegurar que nunca se dupliquen los ids y que este se autogenere).
        - products: Array que contendrá objetos que representen cada producto
      */
      try {
        const cart = await controller.create();
        res.sendSuccess(cart, "Se ha creado un nuevo carrito con todos los prductos con cantidad 0.");
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.post("/:cid/products/:pid", handlePolicies(["self"]), async (req, res) => {
      /*
        La ruta POST  /:cid/product/:pid deberá agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el siguiente formato:
        - product: SÓLO DEBE CONTENER EL ID DEL PRODUCTO (Es crucial que no agregues el producto completo)
        - quantity: debe contener el número de ejemplares de dicho producto. El producto, de momento, se agregará de uno en uno.
        
        Además, si un producto ya existente intenta agregarse al producto, incrementar el campo quantity de dicho producto. 
      */

      try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const updatedCart = await controller.add(cartId, productId);

        res.sendSuccess(updatedCart, `Se ha agregado una undidad del producto con el id ${productId} al carrito ${cartId}.`);
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.delete("/:cid", async (req, res) => {
      try {
        //"DELETE /:cid/products" Vacía el array del carrito cid
        const id = req.params.cid;
        const emptiedCart = await controller.emptyCart(id);
        res.sendSuccess(emptiedCart);
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.delete("/:cid/products/:pid", async (req, res) => {
      try {
        //"DELETE /:cid/products/:pid" Quita el producto pid del array del carrito cid
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const deletedProduct = await controller.deleteOneProduct(productId, cartId);

        res.sendSuccess(deletedProduct);
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.post("/:cid/purchase", async (req, res) => {
      /*
      Implementar, en el router de carts, la ruta /:cid/purchase, la cual permitirá finalizar el proceso de compra de dicho carrito.
      
      La compra debe corroborar el stock del producto al momento de finalizarse
        -Si el producto tiene suficiente stock para la cantidad indicada en el producto del carrito, entonces restarlo del stock del producto y continuar.
        -Si el producto no tiene suficiente stock para la cantidad indicada en el producto del carrito, entonces no agregar el producto al proceso de compra. 
      
      Al final, utilizar el servicio de Tickets para poder generar un ticket con los datos de la compra.
      En caso de existir una compra no completada, devolver el arreglo con los ids de los productos que no pudieron procesarse.
      Una vez finalizada la compra, el carrito asociado al usuario que compró deberá contener sólo los productos que no pudieron comprarse. 
      Es decir, se filtran los que sí se compraron y se quedan aquellos que no tenían disponibilidad.
      */

      try {
        // 1- traer los datos del carrito 
        // 2- recorrerlo comparando el quantity con el stock de cada producto
        // 3- generar el ticket
        // 4- actualizar el stock de los productos
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    // Falta implementar
    this.put("/:cid", async (req, res) => {
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

    // Falta implementar
    this.put("/:cid/products/:pid", async (req, res) => {});

    //Siempre al último por si no entra a ningún otro endpoint
    this.router.all("*", async (req, res) => {
      res.sendServerError(new Error("No se encuentra la ruta seleccionada"));
    });
  }
}
