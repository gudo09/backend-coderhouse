import cartModel from "@models/carts.model.js";
import productModel from "@models/products.model.js";

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

  add = async (cartId: string, productId: string) => {
    try {
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
          { _id: cartId }, // Filtro para encontrar sólo el carrito
          {
            $push: { products: { _id: productId, quantity: 1 } }, // Inserto el nuevo elemento con cantidad 1
          },
          {
            new: true,
            upsert: true,
          }
        );
      }

      return updatedCart;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  create = async () => {
    // Crea un carrito con todos los productos con cantidad 0
    try {
      const products = await productModel.find({}, { _id: 1 }).lean();

      //agrego el campo quantity a cada producto
      const newProducts = products.map((element) => {
        return { product: element._id, quantity: 0 };
      });

      const cart = await cartModel.create({ products: newProducts });

      // Eliminar temporalmente los _id de los productos en la respuesta
      const cartWithoutIds = {
        products: cart.products.map((product) => ({
          product: product.product,
          quantity: product.quantity,
        })),
      };

      return cartWithoutIds;
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

  emptyCart = async (_id: any) => {
    try {
      const result = await cartModel.findByIdAndUpdate(
        _id,
        { products: [] }, // Actualizo el campo products a un array vacío
        { new: true } // Devuelvo el documento actualizado, en este caso un [] vacío
      );

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
      // Elimino el producto del carrito
      const result = await cartModel.findByIdAndUpdate(_idCart, { $pull: { products: { product: _idProduct } } }, { new: true });

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
