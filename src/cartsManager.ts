import { promises as fs } from "fs";

import { fileURLToPath } from "url";
import { dirname } from "path";
import { ProductWithId } from "./productManager.js";
import config from "./config.js";

//obtengo la ruta absoluta de este archivo para leer de forma relativa al products.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Defino una interfaz para Product
interface Cart {
  products: ProductWithId[];
  [key: string]: any; // índice de cadena para permitir el acceso a propiedades adicionales
}

// Defino una interfaz extendida para Product con un id
interface CartWithId extends Cart {
  id: number;
}

class cartsManager {
  carts: CartWithId[];
  path: string;
  id: number = 1;
  idPath: string;

  // metodo que permite ejecutar funciones asincronas en el constructor
  async init() {
    this.id = await this.getId();
  }

  constructor() {
    this.carts = [];
    this.path = `${config.DIRNAME}/carts.json`;
    this.idPath = `${config.DIRNAME}/CartNextId.txt`;
    this.init();
  }

  //creo el metodo addProduct que va a recibir un elemento del tipo Product y lo agrega al products.json
  //el metodo es de tipo void porque no retorna nada
  async addCart(cart: Cart): Promise<void> {
    //le agrego un id al nuevo producto
    const newCartWithId: CartWithId = { id: this.id, ...cart };

    //actualizo el arreglo products de la clase
    await this.updateArrayCarts();

    /*
    //Valido que el id del producto a agregar para que no se repita y ajusto el incremento del id
    if (this.products.length !== 0) {
      let duplicatedId: boolean = true;
      while (duplicatedId === true) {
        duplicatedId = this.isSomeProductWith("id", this.id);
        duplicatedId && this.id++;
      }
    }
    */

    this.carts.push(newCartWithId);
    await this.updateJson();

    //aumento el id para el siguiente producto
    this.setId();
  }

  async getId(): Promise<number> {
    //obtengo el id del archivo txt
    const lastId: number = parseInt(await fs.readFile(this.idPath, "utf-8"));
    return lastId;
  }

  async setId(): Promise<void> {
    //incremento el id del array de products y lo guardo en el txt del id
    this.id++;
    await fs.writeFile(this.idPath, JSON.stringify(this.id));
  }

  //metodo para actualizar el archivo json
  async updateJson(): Promise<void> {
    await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
  }

  //el metodo es de tipo Promise<ProductWithId[]> porque retorna una promesa de un arreglo con los productos y su respectivos id
  async getCarts(limit: number): Promise<CartWithId[]> {
    const importCarts: string | undefined = await fs.readFile(this.path, "utf-8");
    // si el json esta vacío lo creo con un []
    const carts: CartWithId[] = importCarts ? JSON.parse(importCarts): [];
    return limit === 0 ? carts : carts.slice(0, limit);
  }

  //actualiza el array de productos con lo que hay en el json
  async updateArrayCarts(): Promise<void> {
    this.carts = await this.getCarts(0);
  }

  //metodo para buscar si hay algun producto con alguna propiedad y valor en especifico
  async isSomeProductWith(
    propertyName: string,
    propertyValue: any
  ): Promise<boolean> {
    await this.updateArrayCarts();
    return this.carts.some((cart) => propertyValue === cart[propertyName]);
  }

  //el metodo es de tipo Promise<string> porque retorna un mensaje por consola
  //recibe un id como parametro y devuelve un mensaje (ya sea que se haya encontrado o no)
  async getCartById(id: number): Promise<CartWithId | undefined> {
    await this.updateArrayCarts();
    // busco el producto y lo devuelvo
    const result: CartWithId | undefined = this.carts.find(
      (cart: CartWithId) => id === cart.id
    );
    return result;
  }
}

export default cartsManager;
