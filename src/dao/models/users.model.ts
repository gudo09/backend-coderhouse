import mongoose, { PaginateModel, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

mongoose.pluralize(null);

const collection = "users";

interface userDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "admin" | "user" | "premium";
}

export const userSchema = new Schema<userDocument>({
  firstName: { type: "string", required: true },
  lastName: { type: "string", required: true },
  email: { type: "string", required: true },
  password: { type: "string", required: true },
  role: { type: "string", enum: ["admin", "user", "premium"], default: "user" },
});

userSchema.plugin(mongoosePaginate);

const usersModel = mongoose.model<userDocument, PaginateModel<userDocument>>(
  collection,
  userSchema
);
export default usersModel;
