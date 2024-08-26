import { factoryUserService } from "../services/dao/dao.factory.ts";
import { FilterQuery, PaginateOptions } from "mongoose";
import { isValidPassword } from "../services/utils.ts";
import { User } from "../models/users.model.ts";

const service = factoryUserService;

class usersManager {
  constructor() {}

  getAll = async (limit = 0) => {
    try {
      return await service.getAll(limit);
    } catch (err) {
      return (err as Error).message;
    }
  };

  getById = async (id: any) => {
    try {
      return await service.getById(id);
    } catch (err) {
      return (err as Error).message;
    }
  };

  getOne = async (filter: FilterQuery<User>) => {
    try {
      return await service.getOne(filter);
    } catch (err) {
      return (err as Error).message;
    }
  };

  getPaginated = async (filter: FilterQuery<User>, options: PaginateOptions) => {
    try {
      return await service.getPaginated(filter, options);
    } catch (err) {
      return (err as Error).message;
    }
  };

  add = async (newData: Partial<User>) => {
    try {
      return await service.add(newData);
    } catch (err) {
      return (err as Error).message;
    }
  };

  update = async (filter: FilterQuery<User>, update: any, options: any) => {
    try {
      return await service.update(filter, update, options);
    } catch (err) {
      return (err as Error).message;
    }
  };

  delete = async (filter: FilterQuery<User>) => {
    try {
      return await service.delete(filter);
    } catch (err) {
      return (err as Error).message;
    }
  };

  login = async (_email: string, _password: string): Promise<User | null> => {
    try {
      const user = await service.getOne({ email: _email });

      if (!user || !isValidPassword(_password, user.password)) return null;

      return user;
    } catch (err) {
      throw (err as Error).message;
    }
  };

  register = async (_email: string): Promise<User | null> => {
    try {
      const user = await service.getOne({ email: _email });

      if (!user) return null;

      return user;
    } catch (err) {
      throw (err as Error).message;
    }
  };
}

export default usersManager;
