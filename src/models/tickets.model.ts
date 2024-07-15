import mongoose, { InferSchemaType, PaginateModel, Schema } from "mongoose";
// import mongoosePaginate from "mongoose-paginate-v2";

mongoose.pluralize(null);

const collection = "tickets";

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

const ticketSchema = new Schema({
  code: { type: Schema.Types.ObjectId, required: true , unique: true},
  purchaser: { type: String, required: true },
  products: [productSchema],
  purchase_datetime: { type: Date, default: Date.now },
  amount: { type: Number },
});

// Creo el tipo Order con el schema
export type Ticket = InferSchemaType<typeof ticketSchema>;
const usersModel = mongoose.model<Ticket, PaginateModel<Ticket>>(collection, ticketSchema);
