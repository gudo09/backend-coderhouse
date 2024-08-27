import mongoose from "mongoose";
import config from "../../src/config.ts";

export default class MongoSingleton {
  static #instance: MongoSingleton | null = null;

  constructor() {
    this.connect();
  }

  async connect() {
    await mongoose.connect(config.MONGOBD_URI as string);
  }

  static getInstance(): MongoSingleton {
    if (!this.#instance) {
      this.#instance = new MongoSingleton();
      console.log("Conexión a base de datos CREADA");
    } else {
      console.log("Conexión a base de datos RECUPERADA");
    }

    return this.#instance;
  }
}
