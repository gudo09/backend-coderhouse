import mongoose, { Schema } from "mongoose";

mongoose.pluralize(null);

const collection = "products";

const schema = new Schema({
  title: { type: String, required: true },
  description: {},
  price: {},
  thumbnail: {},
  code: {},
  stock: {},
  status: {},
  category: {},
  quantity: {},
});

const model = mongoose.model(collection, schema);

export default model;
