import usersModel, { User } from "@models/users.model.js";
import { IUserService } from "../interfaces.js";
import { FilterQuery, PaginateOptions } from "mongoose";

class UsersService implements IUserService {
  constructor() {}

  getAll = async (limit: number) => {
    try {
      return limit === 0 ? await usersModel.find().lean() : await usersModel.find().limit(limit).lean();
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  getById = async (id: string) => {
    try {
      return await usersModel.findById(id).lean();
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  getOne = async (filter: FilterQuery<User>) => {
    try {
      return await usersModel.findOne(filter).lean();
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  getPaginated = async (filter: FilterQuery<User>, options: PaginateOptions) => {
    try {
      return await usersModel.paginate(filter, options);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  add = async (newData: Partial<User>) => {
    try {
      return await usersModel.create(newData);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  update = async (filter: FilterQuery<User>, update: Partial<User>, options?: any) => {
    try {
      return await usersModel.findOneAndUpdate(filter, update, options);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
  
  delete = async (filter: FilterQuery<User>) => {
    try {
      return await usersModel.findOneAndDelete(filter);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
}

export default UsersService;
