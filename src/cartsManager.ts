import { promises as fs } from "fs";

import { ProductWithId } from "./productManager.js";
import config from "./config.js";

// Defino una interfaz para Cart
interface Cart {
  products: ProductWithId[];
  [key: string]: any; // índice de cadena para permitir el acceso a propiedades adicionales
}

// Defino una interfaz extendida para Cart con un id
interface CartWithId extends Cart {
  id: number;
}

class cartsManager  {
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
    const importCarts: string | undefined = await fs.readFile(
      this.path,
      "utf-8"
    );
    // si el json esta vacío lo creo con un []
    const carts: CartWithId[] = importCarts ? JSON.parse(importCarts) : [];
    return limit === 0 ? carts : carts.slice(0, limit);
  }

  //actualiza el array de productos con lo que hay en el json
  async updateArrayCarts(): Promise<void> {
    this.carts = await this.getCarts(0);
  }

  //metodo para buscar si hay algun producto con alguna propiedad y valor en especifico
  async isSomeCartWith(
    propertyName: string,
    propertyValue: any
  ): Promise<boolean> {
    await this.updateArrayCarts();
    return this.carts.some((cart) => propertyValue === cart[propertyName]);
  }

  //el metodo es de tipo Promise<string> porque retorna un mensaje por consola
  //recibe un id como parametro y devuelve un mensaje (ya sea que se haya encontrado o no)
  async getCartById(id: number): Promise<CartWithId> {
    await this.updateArrayCarts();
    // busco el producto y lo devuelvo
    const result: CartWithId = this.carts.find(
      (cart: CartWithId) => id === cart.id
    ) as CartWithId;
    return result;
  }

  async addProductToCart(productId: number, cartId: number) {
    // uso map para recorrer el carrito y actualizarlo
    this.carts.map(cart => {
      //busco el carrito con el id en cuestion
      if (cart.id === cartId) {
        // busco si existe el producto con el id en cuestion
        const findProduct = cart.products.find((product)=> product.id === productId);
        
        findProduct
          //si lo encuentro y su quantity es undefined, lo igualo a 0 y le sumo 1
          ? findProduct.quantity = (findProduct.quantity|| 0) + 1   
          // si no lo encuentro lo agrego al arreglo de productos
          : cart.products.push({id: productId, quantity: 1})
      }else{
        //si no es el carrito que busco, lo retorno tal como está
        return cart
      }

    })
    //console.log(JSON.stringify(this.carts, null,2))

    //this.carts.push(updatedProducts as unknown as CartWithId);
    this.updateJson();
  }
}

export default cartsManager;
