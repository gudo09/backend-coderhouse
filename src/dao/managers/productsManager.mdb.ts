import productModel from "@models/products.model.js";
import { Product } from "@customTypes/productTypes.js";

class productsManager {
  constructor() {}

  getAll = async (_limit: any, _sort: any, _query: any, _page: any) => {
    try {
      //Valido los parametros y les pongo valores por defecto en caso de no recibirlos
      const limit: number = typeof _limit === "string" ? +_limit : 10;
      const page: number = typeof _page === "string" ? +_page : 1;
      const sort: number = +(_sort === "1" || _sort === "-1" ? _sort : 1);
      const query: Record<string, any> =
        typeof _query === "string" ? JSON.parse(_query) : _query; // Utilizo el generico Record de Typescript para tipar query

      const options = {
        limit: limit,
        sort: { price: sort },
        page: page,
      };

      const paginatedProducts = await productModel.paginate(query, options);

      // Construyo los enlaces para la página previa y siguiente
      // Uso encodeURIComponent para encriptar el query
      let prevLink = null;
      let nextLink = null;
      if (paginatedProducts.hasPrevPage) {
        prevLink = `/views/products/?limit=${limit}&page=${page - 1}&sort=${sort}`;
        if (_query)
          prevLink += `&query=${encodeURIComponent(JSON.stringify(query))}`; // Solo añado query si no es undefined
      }
      if (paginatedProducts.hasNextPage) {
        nextLink = `/views/products?limit=${limit}&page=${page + 1}&sort=${sort}`;
        if (_query)
          nextLink += `&query=${encodeURIComponent(JSON.stringify(query))}`;
      }

      // Respuesta
      return { ...paginatedProducts, prevLink, nextLink };
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  add = async (newData: Product) => {
    try {
      // valido si el código del producto a agregar está repetido
      const isDuplicateCode = await productModel.exists({ code: newData.code });

      // verifico que el codigo a agregar ya existe
      if (isDuplicateCode) {
        throw new Error(
          `El código ${newData.code} ya existe en otro producto.`
        );
      }
      return await productModel.create(newData);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  getById = async (id: string) => {
    try {
      const product = await productModel.findById(id);
      if (!product) {
        throw new Error("Producto no encontrado");
      }
      return product;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  update = async (id: any, body: any) => {
    try {
      const code = body.code;
      const productToUpdate = await productModel.findById(id);

      //valido que el codigo nuevo no sea repetido con el de otro producto
      const productWithCode = await productModel.find({ code: code });
      productWithCode.forEach((product) => {
        if (productToUpdate !== product) {
          throw new Error(
            "Ya existe otro producto con ese código. No se pudo actualizar."
          );
        }
      });

      const updatedProduct = await productModel.findByIdAndUpdate(id, body, {
        new: true,
      });

      return updatedProduct;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  delete = async (id: string) => {
    try {
      const product = await productModel.findByIdAndDelete(id);

      if (product === null) {
        throw new Error("No se ha encontrado el producto para eliminar.");
      }

      return product;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
}

export default productsManager;
