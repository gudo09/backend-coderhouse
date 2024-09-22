import moment from "moment";
import mongoose, { InferSchemaType, PaginateModel, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

mongoose.pluralize(null);

const collection = `users`;

export const userSchema = new Schema({
  firstName: { type: "string", required: true },
  lastName: { type: "string", required: true },
  email: { type: "string", required: true, unique: true },
  password: { type: "string", required: true },
  role: { type: "string", enum: ["admin", "user", "premium"], default: "user" },
  // FIXME: verificar que sea requerido en las solicitudes de User
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: `tickets`,
    },
  ],
  // FIXME: verificar que sea requerido en las solicitudes de User
  documents: [
    {
      name: { type: String, required: true },
      reference: { type: String, required: true, default: "" },
    },
  ],
  // FIXME: verificar que sea requerido en las solicitudes de User e implementar que cambie cuando se conecte el usuario o guarde la hora cuando se desconecte 
  last_connection: { type: Date, required: true, default: moment().format("YYYY-MM-DD HH:mm:ss")},
  // FIXME: verificar que sea requerido en las solicitudes de User
  cart_id: { type: Schema.Types.ObjectId, required: true, default: new mongoose.Types.ObjectId },
});

userSchema.plugin(mongoosePaginate);

// Creo la interfaz User con el schema
export interface User extends InferSchemaType<typeof userSchema> {
  _id: mongoose.Types.ObjectId;
  toJSON: any;
}

// Creo el tipo User con el schema
//export type User = InferSchemaType<typeof userSchema> & { _id: mongoose.Types.ObjectId };

export type UserSession = Omit<User, "password"> & {
  // Aquí password es opcional para el uso de sessiones
  password?: string;
};

const model = mongoose.model<User, PaginateModel<User>>(collection, userSchema);

export default model;
