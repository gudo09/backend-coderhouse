import cartModel, { Cart } from "@models/carts.model.js";
import { ICartService } from "../interfaces.js";
import { FilterQuery, ObjectId, PaginateOptions, PaginateResult } from "mongoose";

class CartsService implements ICartService {
  constructor() {}
  getPaginated = async (query: FilterQuery<Cart>, options: PaginateOptions): Promise<PaginateResult<Cart>> => {
    try {
      return await cartModel.paginate(query, options);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  getById = async (id: string): Promise<Cart | null> => {
    try {
      return await cartModel
        .findById(id)
        .populate({
          path: "products.product",
          model: "products",
        })
        .lean();
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  add = async (cid: string, pid: string): Promise<Cart | null> => {
    try {
      const updatedCart = await cartModel.findOneAndUpdate(
        { _id: cid, "products._id": pid }, // Filtro para encontrar el carrito y el producto especifico
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
          { _id: cid }, // Filtro para encontrar sólo el carrito
          {
            $push: { products: { _id: pid, quantity: 1 } }, // Inserto el nuevo elemento con cantidad 1
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

  clearCart = async (id: string): Promise<Cart | null> => {
    try {
      return await cartModel.findByIdAndUpdate(
        id,
        { products: [] }, // Actualizo el campo products a un array vacío
        { new: true } // Devuelvo el documento actualizado, en este caso un [] vacío
      );
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  createCart = async (newProducts: {product: ObjectId, quantity: number}[]): Promise<Cart | null> =>{
    try {
      return await cartModel.create({ products: newProducts });
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  deleteOneProduct = async (cid: any, pid: any): Promise<Cart|null> => {
    try {
      // Elimino el producto del carrito
      return await cartModel.findByIdAndUpdate(
        cid,
        {
          $pull: {
            products: { product: pid },
          },
        },
        { new: true }
      );
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
}

export default CartsService;
