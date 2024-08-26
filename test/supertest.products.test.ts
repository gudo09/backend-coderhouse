/* eslint-disable @typescript-eslint/no-unused-expressions */
import chai from "chai";
import supertest from "supertest";
import { Product } from "../src/models/products.model";
import mongoose from "mongoose";

const expect = chai.expect;
const requester = supertest("http://localhost:5000");

let cookie;

const testProduct: Product = {
  title: "Titulo de preuba",
  description: "Descripcion de prueba",
  price: 99999,
  code: "cPrueba",
  stock: 112,
  category: "categoria de preubas",
  owner: new mongoose.Types.ObjectId("6668ec41aecadcdf3fc7b15b"),
};

/**
 *
 * @function before se ejecuta antes que todas las pruebas it()
 * @function beforeEach se ejecuta antes de cada una de las pruebas it()
 * @function after se ejecuta despues que todas las pruebas it()
 * @function afterEach se ejecuta despues de cada una de las pruebas it()
 */
describe("Test de integracion ProductsService", () => {
  before(() => {});
  beforeEach(() => {});
  after(() => {});
  afterEach(() => {});

  it("GET /api/products/all/ debe retornar un arreglo con todos los productos", async function () {
    /**
     * En el send se envía el usuario nuevo en el body
     * En _body está la respuesta del requester de supertest
     */
    const { _body, statusCode, ...response } = await requester.get("/api/products/all");

    //console.log(_body)
    //console.log(statusCode)
    //console.log(`Redirige a "${header.location}"`)
    //console.log(_body)

    expect(_body.error).to.be.undefined;
    expect(_body.payload).to.be.an("array");
    expect(statusCode).to.equal(200);
  });
});
