import mongoose, { Schema } from "mongoose";
mongoose.pluralize(null);
const collection = "products";
const schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { type: [String] },
    code: { type: String, required: true, unique: true },
    stock: { type: Number, required: true },
    status: { type: Boolean, default: true },
    category: { type: String, required: true },
    quantity: { type: Number },
});
const model = mongoose.model(collection, schema);
export default model;
