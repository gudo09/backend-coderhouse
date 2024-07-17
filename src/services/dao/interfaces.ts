// services/interfaces.ts

import { Product } from "@models/products.model.js";
import { User } from "@models/users.model.js";
import { FilterQuery, ModifyResult, PaginateOptions, PaginateResult, Types } from "mongoose";

export interface IProductService {
  // Métodos y propiedades del servicio de productos
  getById(id: string): Promise<Product | null>;
  find(filter: FilterQuery<Product>): Promise<Product[]>;
  getPaginated(query: FilterQuery<Product>, options: PaginateOptions): Promise<PaginateResult<Product>>;
  exists(filter: FilterQuery<Product>): Promise<{ _id: Types.ObjectId } | null>;
  add(newProduct: Product): Promise<Product>;
  findByIdAndUpdate(id: string, body: Partial<Product>): Promise<Product | null>;
  findByIdAndDelete(id: string): Promise<Product | null>;
}

export interface IUserService {
  // Métodos y propiedades del servicio de usuarios
  getAll(limit: number): Promise<User[]>;
  getById(id: string): Promise<User | null>;
  getOne(filter: FilterQuery<User>): Promise<User | null>;
  getPaginated(filter: FilterQuery<User>, options: PaginateOptions): Promise<PaginateResult<User>>;
  add(newData: Partial<User>): Promise<User>;
  update(filter: FilterQuery<User>, update: Partial<User>, options?: any): Promise<ModifyResult<User>>;
  delete(filter: FilterQuery<User>): Promise<User | null>;
  // Otros métodos...
}

export interface ICartService {
  // Métodos y propiedades del servicio de carritos
  //getCartById(id: string): Promise<Cart>;
  // Otros métodos...
}

export interface ITicketService {
  // Métodos y propiedades del servicio de tickets
  //getTicketById(id: string): Promise<Ticket>;
  // Otros métodos...
}
