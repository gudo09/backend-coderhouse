import mongoose, { InferSchemaType, PaginateModel, Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

mongoose.pluralize(null);

const collection = `products`;

const defaultAdminUserId = "6660bc95a74513d9aea821d9"; // ID real del usuario admin

export const productSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: [String], required: false },
  code: { type: String, required: true },
  stock: { type: Number, required: true },
  status: { type: Boolean, default: true, required: false },
  category: { type: String, required: true },
  owner: {
    type: Schema.Types.ObjectId,
    ref: `users`,
    required: true,
    default: defaultAdminUserId, // Establecer el valor por defecto
  },
});

productSchema.plugin(mongoosePaginate);

// Creo la interfaz Product con el productSchema
export interface Product extends InferSchemaType<typeof productSchema> {
  _id: Types.ObjectId;
}

const model = mongoose.model<Product,PaginateModel<Product>>(collection, productSchema);

export default model;
