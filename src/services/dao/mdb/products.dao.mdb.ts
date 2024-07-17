import productModel, { Product } from "@models/products.model.js";

import { FilterQuery, PaginateOptions } from "mongoose";
import { IProductService } from "../interfaces.js";

class ProductsService implements IProductService{
  constructor() {}

  getById = async (id: string) => {
    try {
      return await productModel.findById(id);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  find = async (filter: FilterQuery<Product>) => {
    try {
      return await productModel.find(filter);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  getPaginated = async (query: FilterQuery<Product>, options: PaginateOptions) => {
    try {
      return await productModel.paginate(query, options);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  exists = async (filter: FilterQuery<Product>) =>  {
    try {
      return await productModel.exists(filter);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  add = async (newProduct: Product) => {
    try {
      return await productModel.create(newProduct);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  findByIdAndUpdate= async (id: string, body: any) =>{
    try {
      return await productModel.findByIdAndUpdate(id, body, {
        new: true,
      });
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  findByIdAndDelete= async (id: string) =>{
    try {
      return await productModel.findByIdAndDelete(id);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

}

export default ProductsService;
