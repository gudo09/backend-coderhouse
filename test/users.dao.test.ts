import assert from "assert";
import mongoose from "mongoose";
//import config from "../config.ts";

//import mongoose from "mongoose";
import UsersService from "../src/services/dao/mdb/users.dao.mdb.ts";
//import { User } from "models/users.model.ts";

//console.log(new URL('../src/services/dao/mdb/users.dao.mdb.js'))

//const UsersService = await import(new URL('../src/services/dao/mdb/users.dao.mdb.js', import.meta.url).pathname);

//const connection = await mongoose.connect(config.MONGOBD_URI)

const dao = new UsersService();
//const assert = Assert.strict
const testUser = {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  password: "",
  role: "premium",
  cart_id: new mongoose.Types.ObjectId("6668ec41aecadcdf3fc7b15b")
};

/**
 *
 * @function before se ejecuta antes que todas las pruebas it()
 * @function beforeEach se ejecuta antes de cada una de las pruebas it()
 * @function after se ejecuta despues que todas las pruebas it()
 * @function afterEach se ejecuta despues de cada una de las pruebas it()
 */
describe("Test UsersService", () => {
  before(() => {});
  beforeEach(() => {});
  after(() => {});
  afterEach(() => {});

  it("getAll() debe retornar una lista de ususarios", async () => {
    const result = await dao.getAll();
    assert.strictEqual(Array.isArray(result), true);
  });
});
