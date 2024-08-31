/* eslint-disable @typescript-eslint/no-unused-expressions */
import chai from "chai";
import supertest from "supertest";
import { Product } from "../../src/models/products.model";
import { User } from "../../src/models/users.model";
import mongoose from "mongoose";

const expect = chai.expect;
const requester = supertest("http://localhost:5000");

let cookie;

const testUser = {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  password: "124",
  role: "premium",
  cart_id: new mongoose.Types.ObjectId("6668ec41aecadcdf3fc7b15b"),
  orders: [],
};

const testUserAdmin = {
    email: "admin@example.com",
    password: "adminpassword"
}

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
    const response = await requester.get("/api/dev/db");

    // Verifica que la URI de la base de datos contenga el sufijo "_test"
    expect(response.body.payload).to.be.equal("TEST", 'La base de datos conectada no es una base de datos de prueba. Pruebe ejecutando "npm run dev-test"');
  });
  beforeEach(() => {});
  after(() => {});
  afterEach(() => {});

  it("POST /api/sessions/jwtlogin Debe devolver un token JWT y redirigir a '/profile' ", async function () {
    const response = await requester
      .post("/api/sessions/jwtlogin")
      .send(testUserAdmin)
      .redirects(10) // hago seguimiento hasta 10 redirecciones

    expect(response.redirects[0]).to.equal('http://localhost:5000/profile');
    expect(response.statusCode).to.be.equal(200);

  });

});
