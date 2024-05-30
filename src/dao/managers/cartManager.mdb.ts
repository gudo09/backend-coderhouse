import cartModel from "@models/carts.model.js";

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
          model: "products",
        },
      };

      const paginatedCart = await cartModel.paginate({}, options);

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
      const cart = await cartModel
        .findById(id)
        .populate({
          path: "products.product",
          model: "products",
        })
        .lean();

      if (!cart) {
        throw new Error("No se encuenta el carrito.");
      }

      return cart;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  add = async (_newData: any) => {
    try {
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  getById = async (_id: any) => {
    try {
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  update = async (_id: any, _updProd: any) => {
    try {
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  delete = async (_idDelete: any) => {
    try {
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
}

export default cartsManager;
