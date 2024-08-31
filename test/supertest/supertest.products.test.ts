/* eslint-disable @typescript-eslint/no-unused-expressions */
import chai from "chai";
import supertest from "supertest";
import { Product } from "../../src/models/products.model";
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
  before(async () => {
    // Verificar que estamos conectados a la base de datos de prueba
    const response = await requester.get('/api/dev/db');
    
    // Verifica que la URI de la base de datos contenga el sufijo "_test"
    expect(response.body.payload).to.be.equal('TEST', 'La base de datos conectada no es una base de datos de prueba. Pruebe ejecutando "npm run dev-test"');
  });
  beforeEach(() => {});
  after(() => {});
  afterEach(() => {});

  it("GET /api/products/all/ debe retornar un arreglo con todos los productos", async function () {
    /**
     * En el send se envía el usuario nuevo en el body
     * En _body está la respuesta del requester de supertest
     */
    const response = await requester.get("/api/products/all")

    //console.log(JSON.stringify(response.redirects))

    expect(response.body.error).to.be.undefined;
    expect(response.body.payload).to.be.an("array");
    expect(response.statusCode).to.equal(200);
  });
});
