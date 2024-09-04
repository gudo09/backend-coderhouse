import CartsService from "../services/dao/mdb/carts.dao.mdb.ts";
import ProductsController from "./products.controller.mdb.ts";

const service = new CartsService();

const productsController = new ProductsController();

class cartsManager {
  constructor() {}

  formatCart = (cart: any) => {
    try {
      const productsArray = cart.products
        //filtro los product que sean mayor a 0
        .filter((product: { quantity: number }) => product.quantity > 0)
        // Mapeo el array de productos para quitar la propiedad _id del objeto product
        .map((product: { _id: any; quantity: number }) => {
          // Extraigo id y quantity de cada producto
          const { _id, quantity } = product;
          if (typeof _id === "object") {
            return { ..._id, quantity };
          } else {
            throw new Error("Estructura no esperada en product _id");
          }
        });

      //Retorno todo lo que había en cart pero con el array de productos formateado
      return { ...cart, products: productsArray };
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  getAll = async (_limit: any, _page: any) => {
    try {
      //valido los parametros y les pongo valores por defecto en caso de no recibirlos
      const limit: number = typeof _limit === "string" ? +_limit : 50;
      const page: number = typeof _page === "string" ? +_page : 1;

      const options = {
        limit: limit,
        page: page,
        populate: {
          path: "products.product",
          model: `products`,
        },
      };

      const paginatedCart = await service.getPaginated({}, options);

      return paginatedCart;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  getOne = async (id: string | undefined) => {
    try {
      if (id === undefined) {
        console.log("Debe ingresar el id.");
        throw new Error("Debe ingresar el id.");
      }
      const cart = await service.getById(id);

      if (!cart) {
        throw new Error("No se encuenta el carrito.");
      }

      return cart;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  add = async (cartId: string, productId: string) => {
    try {
      const updatedCart = await service.add(cartId, productId);

      return updatedCart;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  create = async () => {
    // Crea un carrito con todos los productos con cantidad 0
    try {
      const products = await productsController.getOnlyIds();

      //agrego el campo quantity a cada producto
      const newProducts = products.map((element) => {
        return { product: element._id, quantity: 0 };
      });

      const cart = await service.createCart(newProducts);

      // Eliminar temporalmente los _id de los productos en la respuesta
      const cartWithoutIds = {
        products: cart?.products.map((product) => ({
          product: product.product,
          quantity: product.quantity,
        })),
      };

      return cartWithoutIds;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  // FIXME: Falta implementar
  update = async (_id: any, _updProd: any) => {
    try {
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  emptyCart = async (_id: any) => {
    try {
      const result = await service.clearCart(_id);

      if (!result) {
        throw new Error("No se ha encontrado carrito para vaciar.");
      }

      return result;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  deleteOneProduct = async (_idCart: any, _idProduct: any) => {
    try {
      const result = await service.deleteOneProduct(_idCart, _idProduct);

      if (!result) {
        throw new Error("No se ha encontrado el carrito o el producto no está en el carrito.");
      }

      return result;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
}

export default cartsManager;
