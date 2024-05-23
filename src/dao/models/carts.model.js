import mongoose, { Schema } from "mongoose";
mongoose.pluralize(null);
const collection = "carts";
const productSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        ref: "products",
        required: true,
    },
    quantity: {
        type: Number,
        default: 0,
    }
});
const schema = new Schema({
    products: [productSchema],
});
const model = mongoose.model(collection, schema);
export default model;
