import { schema } from "@models/products.model.js";
import { InferSchemaType } from "mongoose";

export interface Product extends InferSchemaType<typeof schema> {}
