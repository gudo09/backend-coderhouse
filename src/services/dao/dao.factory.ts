import config from "@/config.js";

let factoryProductService = {};

switch (config.PERSISTENCE) {
  case "ram":
    const RamService = await import("@dao/old/productManager.js");
    factoryProductService = RamService.default;
    break;

  case "mongo":
    const { default: MongoSingleton } = await import("@services/mongodb.singleton.js");
    await MongoSingleton.getInstance();

    const MongoService = await import("@controllers/products.controller.mdb.js");
    factoryProductService = MongoService.default;
    break;

  default:
    throw new Error(`Persistencia ${config.PERSISTENCE} no soportada`);
}

export default factoryProductService;
