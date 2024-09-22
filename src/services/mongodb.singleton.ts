import mongoose from "mongoose";
import config from "../config.ts";

export default class MongoSingleton {
  static #instance: MongoSingleton;

  constructor() {
    this.connect();
  }

  async connect() {
    try {
      await mongoose.connect(config.MONGOBD_URI);
      console.log("Conexión a base de datos CREADA");
    } catch (err) {
      console.error("Error conectando a la base de datos:", err);
    }
  }

  static async getInstance(): Promise<MongoSingleton> {
    if (!this.#instance) {
      this.#instance = new MongoSingleton();
    } else {
      console.log("Conexión a base de datos RECUPERADA");
    }

    return this.#instance;
  }
}
