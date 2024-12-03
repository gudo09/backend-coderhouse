import usersModel from "@models/users.model.js";
import { PaginateOptions } from "mongoose";
import { ParsedQs } from "qs";
import { User } from "@/types/user.interface.js";
import { isValidPassword } from "@/utils.js";

class usersManager {
  constructor() {}

  getAll = async (limit = 0) => {
    try {
      return limit === 0 ? await usersModel.find().lean() : await usersModel.find().limit(limit).lean();
    } catch (err) {
      return (err as Error).message;
    }
  };

  getById = async (id: any) => {
    try {
      return await usersModel.findById(id).lean();
    } catch (err) {
      return (err as Error).message;
    }
  };

  getOne = async (filter: {}): Promise<User | null | string> => {
    try {
      return await usersModel.findOne(filter).lean();
    } catch (err) {
      return (err as Error).message;
    }
  };

  getPaginated = async (filter: any, options: PaginateOptions | undefined) => {
    try {
      return await usersModel.paginate(filter, options);
    } catch (err) {
      return (err as Error).message;
    }
  };

  add = async (newData: any) => {
    try {
      return await usersModel.create(newData);
    } catch (err) {
      return (err as Error).message;
    }
  };

  update = async (filter: any, update: any, options: any) => {
    try {
      return await usersModel.findOneAndUpdate(filter, update, options);
    } catch (err) {
      return (err as Error).message;
    }
  };

  delete = async (filter: any) => {
    try {
      return await usersModel.findOneAndDelete(filter);
    } catch (err) {
      return (err as Error).message;
    }
  };

  login = async (_email: string, _password: string): Promise<User | null> => {
    try {
      const user = await usersModel.findOne({
        email: _email,
      });

      if (!user || !isValidPassword(_password, user.password)) return null;

      return user;
    } catch (err) {
      throw (err as Error).message;
    }
  };
}

export default usersManager;
