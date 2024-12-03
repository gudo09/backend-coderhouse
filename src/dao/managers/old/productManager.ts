import { promises as fs } from "fs";
import config from "@/config.js";

// Defino una interfaz para Product
interface Product {
  title?: string;
  description?: string;
  price?: number;
  thumbnail?: string[]; // Cambiado a un arreglo de strings
  status?: boolean;
  code?: string;
  stock?: number;
  category?: string;
  quantity?: number;
  [key: string]: any; // índice de cadena para permitir el acceso a propiedades adicionales
}

// Defino una interfaz extendida para Product con un id
export interface ProductWithId extends Product {
  id: number;
}

//creo la clase ProductManager que es la que va a crear instancias
class ProductManager {
  products: ProductWithId[];
  path: string = "";
  id: number = 1;
  idPath: string = "";

  // metodo que permite ejecutar funciones asincronas en el constructor
  async init() {
    this.id = await this.getId();
  }

  //la llamada al constuctor genera un array vacio a inicializa el path con la direccione en donde se guardará el archivo json
  constructor() {
    this.products = [];
    this.path = `${config.DIRNAME}/dao/managers/products.json`;
    this.idPath = `${config.DIRNAME}/dao/managers/ProductNextId.txt`;
    this.init();
  }

  //creo el metodo addProduct que va a recibir un elemento del tipo Product y lo agrega al products.json
  //el metodo es de tipo void porque no retorna nada
  async addProduct(product: Product): Promise<void> {
    //le agrego un id al nuevo producto
    const newProductWithId: ProductWithId = { id: this.id, ...product };

    //actualizo el arreglo products de la clase
    await this.updateArrayProducts();

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

    this.products.push(newProductWithId);
    await this.updateJson();

    //aumento el id para el siguiente producto
    this.setId();
  }

  //el metodo es de tipo Promise<ProductWithId[]> porque retorna una promesa de un arreglo con los productos y su respectivos id
  async getProducts(limit: number): Promise<ProductWithId[]> {
    const importProducts: string = await fs.readFile(this.path, "utf-8");
    // si el json esta vacío le asigno un []
    const products: ProductWithId[] = importProducts
      ? JSON.parse(importProducts)
      : [];
    return limit === 0 ? products : products.slice(0, limit);
  }

  //recibe un id como parametro y devuelve el producto, o undefined si no lo encontró
  async getProductById(id: number): Promise<ProductWithId | undefined> {
    await this.updateArrayProducts();
    // busco el producto y lo devuelvo
    const result: ProductWithId | undefined = this.products.find(
      (prod: ProductWithId) => id === prod.id
    );
    return result;
  }

  async getLastProductAdded(): Promise<ProductWithId> {
    const lastProduct = this.products[this.products.length - 1];
    return lastProduct;
  }

  //el metodo deteleProduct recibe un id y elimila el producto con ese id
  async deteleProduct(id: number): Promise<string> {
    //elimino el producto del arreglo, actualizo el json y devuelvo mensaje
    this.products = this.products.filter(
      (prod: ProductWithId) => prod.id !== id
    );

    //escribo el arreglo actualizado en el json
    await this.updateJson();
    return `El producto con el id ${id} se ha eliminado`;
  }

  //updateProduct recube un id y un objeto de tipo Product para actualizar el producto con dicho id
  async updateProduct(
    id: number,
    updatedProduct: Product
  ): Promise<ProductWithId> {
    await this.updateArrayProducts();

    //elimino el producto con ese id del arreglo
    this.products = this.products.filter(
      (prod: ProductWithId) => prod.id !== id
    );

    //agrego el producto actualizado con ese id al arreglo y actualizo el json
    this.products.push({ id: id, ...updatedProduct });
    await this.updateJson();
    return { id: id, ...updatedProduct };
  }

  //metodo toString para imprimir cada producto
  toString(prod: ProductWithId): string {
    let result: string = "\n";
    for (let propiedad in prod) {
      result += `${propiedad}: ${prod[propiedad]}\n`;
    }
    return result;
  }

  //actualiza el array de productos con lo que hay en el json
  async updateArrayProducts(): Promise<void> {
    this.products = await this.getProducts(0);
  }

  //metodo para buscar si hay algun producto con alguna propiedad y valor en especifico
  async isSomeProductWith(
    propertyName: string,
    propertyValue: any
  ): Promise<boolean> {
    await this.updateArrayProducts();
    return this.products.some(
      (product: ProductWithId) => propertyValue === product[propertyName]
    );
  }

  //metodo para imprimir por consola todos los productos
  async printProducts() {
    try {
      await this.updateArrayProducts();
      let result: string =
        "\n---------------------------\nListado de productos:\n---------------------------\n";
      //recorro el array de productos y ejecuto el toString para cada producto
      this.products.forEach((prod: ProductWithId) => {
        result += this.toString(prod);
      });
      return result + "\n---------------------------";
    } catch (error) {
      return `Error: ${error}`;
    }
  }

  //metodo para actualizar el archivo json
  async updateJson(): Promise<void> {
    await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
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
}

export default ProductManager;