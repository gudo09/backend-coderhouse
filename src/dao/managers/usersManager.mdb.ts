import usersModel from "@models/users.model.js";
import { PaginateOptions } from "mongoose";

class usersManager {
  constructor() {}

  getAll = async (limit = 0) => {
    try {
      return limit === 0
        ? await usersModel.find().lean()
        : await usersModel.find().limit(limit).lean();
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
}
