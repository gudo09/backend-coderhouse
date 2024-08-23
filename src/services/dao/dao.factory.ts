import config from "../../config.js";
import { ICartService, IProductService, ITicketService, IUserService } from "./interfaces.js";

export let factoryProductService: IProductService;
export let factoryCartService: ICartService;
export let factoryUserService: IUserService;
export let factoryTicketService: ITicketService;

switch (config.PERSISTENCE) {
  case "mongo": {
    const { default: MongoSingleton } = await import("../../services/mongodb.singleton.js");
    MongoSingleton.getInstance();

    const MongoProductService = await import("../../services/dao/mdb/products.dao.mdb.js");
    factoryProductService = new MongoProductService.default();

    const MongoUserService = await import("../../services/dao/mdb/users.dao.mdb.js");
    factoryUserService = new MongoUserService.default();

    const MongoCartService = await import("../../services/dao/mdb/carts.dao.mdb.js");
    factoryCartService = new MongoCartService.default();

    const MongoTicketService = await import("../../services/dao/mdb/tickets.dao.mdb.js");
    factoryTicketService = new MongoTicketService.default();

    break;
  }

  default:
    throw new Error(`Persistencia ${config.PERSISTENCE} no soportada`);
}
