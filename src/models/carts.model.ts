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

const cartSchema = new Schema({
  _user_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: `users`,
  },
  products: [productSchema],
});

cartSchema.plugin(mongoosePaginate);

// Creo la interfaz Cart con el cartSchema
export interface Cart extends InferSchemaType<typeof cartSchema> {
  _id: mongoose.Types.ObjectId;
}

const model = mongoose.model<Cart, PaginateModel<Cart>>(collection, cartSchema);

export default model;
