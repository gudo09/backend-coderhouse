import mongoose, { PaginateModel, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

mongoose.pluralize(null);

const collection = "products";

export const schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: [String], required: false },
  code: { type: String, required: true },
  stock: { type: Number, required: true },
  status: { type: Boolean, default: true, required: false },
  category: { type: String, required: true },
});

schema.plugin(mongoosePaginate);

/*
// A implementar para eliminar el type productTypes.ts
export type Product = InferSchemaType<typeof schema>;
const model = mongoose.model<Product, PaginateModel<Product>>(collection, schema);
*/

export interface ProductDocument extends Document {
  title: string;
  description: string;
  price: number;
  thumbnail?: string[];
  code: string;
  stock: number;
  status: boolean;
  category: string;
}

const model = mongoose.model<ProductDocument, PaginateModel<ProductDocument>>(collection, schema);

export default model;
