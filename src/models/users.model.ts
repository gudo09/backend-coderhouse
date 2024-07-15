import mongoose, { InferSchemaType, PaginateModel, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

mongoose.pluralize(null);

const collection = "users";

export const userSchema = new Schema({
  firstName: { type: "string", required: true },
  lastName: { type: "string", required: true },
  email: { type: "string", required: true, unique: true },
  password: { type: "string", required: true },
  role: { type: "string", enum: ["admin", "user", "premium"], default: "user" },
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: "tickets",
    },
  ],
});

userSchema.plugin(mongoosePaginate);

// Creo el tipo User con el schema
export type User = InferSchemaType<typeof userSchema>;

export type UserSession = Omit<User, "password"> & {
  // Aquí password es opcional para el uso de sessiones 
  password?: string;
};

const usersModel = mongoose.model<User, PaginateModel<User>>(collection, userSchema);

/*
const usersModel = mongoose.model<User, PaginateModel<User>>(
  collection,
  userSchema
);
*/

export default usersModel;
