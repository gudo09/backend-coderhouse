import mongoose, { PaginateModel, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

mongoose.pluralize(null);

const collection = "carts";

const productSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
});

const schema = new Schema({
  _user_id: { type: Schema.Types.ObjectId, required: true, ref: "users" },
  products: [productSchema],
});

interface CartDocument extends Document {
  products: {
    product: mongoose.Schema.Types.ObjectId;
    quantity: number;
  }[];
}

schema.plugin(mongoosePaginate);

const model = mongoose.model<CartDocument, PaginateModel<CartDocument>>(
  collection,
  schema
);

export default model;
