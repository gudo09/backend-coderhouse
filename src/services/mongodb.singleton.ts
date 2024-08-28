import mongoose from "mongoose";
import config from "../config.ts";

export default class MongoSingleton {
  static #instance: MongoSingleton;

  constructor() {
    this.connect();
  }

  async connect() {
    await mongoose.connect(config.MONGOBD_URI);
  }

  static async getInstance(): Promise<MongoSingleton> {
    if (!this.#instance) {
      this.#instance = new MongoSingleton();
      // envio mensaje al proceso principal
      process.send?.("readyDB")
    } else {
      console.log("Conexión a base de datos RECUPERADA");
    }

    return this.#instance;
  }
}
