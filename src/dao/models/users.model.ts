import mongoose, { PaginateModel, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import {User} from "@customTypes/user.interface.js";

mongoose.pluralize(null);

const collection = "users";

export const userSchema = new Schema<User>({
  firstName: { type: "string", required:true },
  lastName: { type: "string", required: true },
  email: { type: "string", required: true, unique: true},
  password: { type: "string", required: true },
  role: { type: "string", enum: ["admin", "user", "premium"], default: "user" },
});

userSchema.plugin(mongoosePaginate);

const usersModel = mongoose.model<User, PaginateModel<User>>(
  collection,
  userSchema
);
export default usersModel;