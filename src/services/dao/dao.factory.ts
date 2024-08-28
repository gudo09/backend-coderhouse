import config from "../../config.ts";
import { ICartService, IProductService, ITicketService, IUserService } from "./interfaces.ts";

export let factoryProductService: IProductService;
export let factoryCartService: ICartService;
export let factoryUserService: IUserService;
export let factoryTicketService: ITicketService;

switch (config.PERSISTENCE) {
  case "mongo": {
    const { default: MongoSingleton } = await import("../../services/mongodb.singleton.ts");
    await MongoSingleton.getInstance();

    const MongoProductService = await import("../../services/dao/mdb/products.dao.mdb.ts");
    factoryProductService = new MongoProductService.default();
    
    const MongoUserService = await import("../../services/dao/mdb/users.dao.mdb.ts");
    factoryUserService = new MongoUserService.default();

    const MongoCartService = await import("../../services/dao/mdb/carts.dao.mdb.ts");
    factoryCartService = new MongoCartService.default();

    const MongoTicketService = await import("../../services/dao/mdb/tickets.dao.mdb.ts");
    factoryTicketService = new MongoTicketService.default();
    break;
  }

  default:
    throw new Error(`Persistencia ${config.PERSISTENCE} no soportada`);
}
