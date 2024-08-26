/* eslint-disable @typescript-eslint/no-unused-expressions */
import chai from "chai";
import supertest from "supertest";
import { Product } from "../src/models/products.model";
import { User } from "../src/models/users.model";
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
  orders: []
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

  it("POST /api/sessions/register debe registrar un usuario nuevo", async function () {
    /**
     * En el send se envía el usuario nuevo en el body
     * En _body está la respuesta del requester de supertest
     */
    const {_body, statusCode , header,...response} = await requester.post("/api/sessions/register").send(testUser)

    //console.log(_body)
    //console.log(statusCode)
    //console.log(`Redirige a "${header.location}"`)
    //console.log(_body)


    expect(header.location).to.equal("/profile")
    expect(statusCode).to.equal(200)
    //expect(_body.payload).to.be.ok

  });

  it("POST /api/sessions/register No debe volver a registrar un usuario con el mismo mail", async function () {
    
  });
});
