/* eslint-disable @typescript-eslint/no-unused-expressions */
import dotenv from "dotenv";

import chai from "chai";
import mongoose, {Types}from "mongoose";
import ProductsService from "../src/services/dao/mdb/products.dao.mdb.ts";
import { Product } from "../src/models/products.model.ts";

dotenv.config({ path: ".env.test" });

console.log(`Mongo conectado a: ${process.env.MONGOBD_URI}`);

const _connection = await mongoose.connect(process.env.MONGOBD_URI as string);


const dao = new ProductsService();
const expect = chai.expect
const testProduct : Product = {
  title: "Titulo de preuba",
  description: "Descripcion de prueba",
  price: 99999,
  code: "cPrueba",
  stock: 112,
  category: "",
  owner: new Types.ObjectId("6668ec41aecadcdf3fc7b15b")
};


/*
 */

/**
 *
 * @function before se ejecuta antes que todas las pruebas it()
 * @function beforeEach se ejecuta antes de cada una de las pruebas it()
 * @function after se ejecuta despues que todas las pruebas it()
 * @function afterEach se ejecuta despues de cada una de las pruebas it()
 */
describe("Test ProductsService", () => {
  before(() => {});
  beforeEach(() => {});
  after(() => {});
  afterEach(() => {});

  it("getAll() debe retornar una lista de ususarios", async function () {
    const result = await dao.getAll();
    //console.log(result);
    expect(result).to.be.an('array');
  });

  it("getById() debe retornar un objeto", async function () {
    const result = await dao.getById("664e74bd10af5321572b1d35");
    console.log(result);

    expect(result).to.be.an('object');
    expect(result).to.be.not.null;
    expect(result?._id).to.be.not.null;
    expect(result?.title).to.be.not.null;
    expect(result?.description).to.be.not.null;
    expect(result?.price).to.be.not.null;
    expect(result?.code).to.be.not.null;
    expect(result?.stock).to.be.not.null;
    expect(result?.category).to.be.not.null;
    expect(result?.owner).to.be.not.null;

  });
});