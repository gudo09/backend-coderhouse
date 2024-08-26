import { Product } from "../models/products.model.ts";
import { factoryProductService } from "../services/dao/dao.factory.ts";

const service = factoryProductService;

class ProductDTO {
  product: Product;
  constructor(product: Product) {
    this.product = product;
    this.product.title = this.product.title.toUpperCase();
  }
}

class ProductsController {
  constructor() {}

  getAll = async (limit?:number) => {
    limit = limit || 0
    const result = await service.getAll(limit);
    return result
  }

  getPaginated = async (_limit: any, _sort: any, _query: any, _page: any) => {
    try {
      //Valido los parametros y les pongo valores por defecto en caso de no recibirlos
      const limit: number = typeof _limit === "string" ? +_limit : 10;
      const page: number = typeof _page === "string" ? +_page : 1;
      const sort: number = +(_sort === "1" || _sort === "-1" ? _sort : 1);
      const query: Record<string, any> = typeof _query === "string" ? JSON.parse(_query) : _query; // Utilizo el generico Record de Typescript para tipar query

      const options = {
        limit: limit,
        sort: { price: sort },
        page: page,
      };

      const paginatedProducts = await service.getPaginated(query, options);

      // Construyo los enlaces para la página previa y siguiente
      // Uso encodeURIComponent para encriptar el query
      let prevLink = null;
      let nextLink = null;
      if (paginatedProducts.hasPrevPage) {
        prevLink = `/products/?limit=${limit}&page=${page - 1}&sort=${sort}`;
        if (_query) prevLink += `&query=${encodeURIComponent(JSON.stringify(query))}`; // Solo añado query si no es undefined
      }
      if (paginatedProducts.hasNextPage) {
        nextLink = `/products?limit=${limit}&page=${page + 1}&sort=${sort}`;
        if (_query) nextLink += `&query=${encodeURIComponent(JSON.stringify(query))}`;
      }

      // Respuesta
      return { ...paginatedProducts, prevLink, nextLink };
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  getOnlyIds = async () => {
    try {
      return await service.getOnlyIds();
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  add = async (newData: Product) => {
    try {
      // valido si el código del producto a agregar está repetido
      const isDuplicateCode = await service.exists({ code: newData.code });

      // verifico que el codigo a agregar ya existe
      if (isDuplicateCode) {
        throw new Error(`El código ${newData.code} ya existe en otro producto.`);
      }
      const normalizedNewData = new ProductDTO(newData);
      return await service.add(normalizedNewData.product);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  getById = async (id: string) => {
    try {
      const product = await service.getById(id);
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
      const productToUpdate = await service.getById(id);

      //valido que el codigo nuevo no sea repetido con el de otro producto
      const productWithCode = await service.find({ code: code });
      productWithCode.forEach((product: Product) => {
        if (productToUpdate !== product) {
          throw new Error("Ya existe otro producto con ese código. No se pudo actualizar.");
        }
      });

      const updatedProduct = await service.findByIdAndUpdate(id, body);

      return updatedProduct;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  delete = async (id: string) => {
    try {
      const product = await service.findByIdAndDelete(id);

      if (product === null) {
        throw new Error("No se ha encontrado el producto para eliminar.");
      }

      return product;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
}

export default ProductsController;
