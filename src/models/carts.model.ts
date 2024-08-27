import mongoose, { InferSchemaType, PaginateModel, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

mongoose.pluralize(null);

const collection = `carts`;

const productSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: `products`,
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
});

const schema = new Schema({
  _user_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: `users`,
  },
  products: [productSchema],
});

schema.plugin(mongoosePaginate);

export interface Cart extends InferSchemaType<typeof schema> {}
const model = mongoose.model<Cart, PaginateModel<Cart>>(collection, schema);

export default model;
