import mongoose from "mongoose";
import config from "@/config.js";

export default class MongoSingleton {
  static #instance: MongoSingleton | null = null;

  constructor() {
    this.connect();
  }

  async connect() {
    await mongoose.connect(config.MONGOBD_URI);
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
