import { promises as fs } from "fs";

//creo el ripo Product con los datos necesarios
type Product = {
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  code: string;
  stock: number;
  [key: string]: any; // indice de cadena para permitir el acceso a propiedades adicionales
};

//creo el tipo ProductWithId con los datos del tipo Product mas un id
type ProductWithId = Product & {
  id: number;
};

//creo la clase ProductManager que es la que va a crear instancias
class ProductManager {
  path: string = "";
  id: number = 1;

  //la llamada al constuctor genera un array vacio
  constructor() {
    this.path = "./src/products.json";
  }

  //creo el metodo addProduct que va a recibir un elemento del tipo Product y lo agrega al products.json
  //el metodo es de tipo void porque no retorna nada
  async addProduct(product: Product): Promise<void> {
    //le agrego un id al nuevo producto
    const newProductWithId: ProductWithId = { id: this.id, ...product };

    //traigo todos los productos del json a un arreglo
    const products: ProductWithId[] = await this.getProducts();

    //Valido si la propiedad code se repite en algun otro producto
    const duplicatedCode: boolean = products.some(
      (product) => product.code === newProductWithId.code
    );

    //Si está diplicado muestro un mensaje por consola y salgo del metodo
    if (duplicatedCode) {
      console.log(
        `\nEl código ${newProductWithId.code} ya existe en otro producto, no se pudo agregar el producto con el título '${newProductWithId.title}'`
      );
      return;
    }

    //Si no está repetido, lo agrego al arreglo y guardo el arreglo en el json
    products.push(newProductWithId);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));

    //aumento el id para el siguiente producto
    this.id++;
  }

  //el metodo es de tipo Promise<ProductWithId[]> porque retorna una promesa de un arreglo con los productos y su respectivos id
  async getProducts(): Promise<ProductWithId[]> {
    const importProducts: string = await fs.readFile(this.path, "utf-8");
    const products: ProductWithId[] = JSON.parse(importProducts);
    return products;
  }

  //el metodo es de tipo Promise<string> porque retorna un mensaje por consola
  async getProductById(id: number): Promise<string> {
    const products = await this.getProducts();
    const result: ProductWithId | undefined = products.find(
      (prod: ProductWithId) => id === prod.id
    );
    if (result === undefined)
      return `\nNo se ha encontrado el producto con el ID ${id}`;
    return `\nSe ha encontrado un producto con el id ${id}:\n${this.toString(
      result
    )}`;

    //return JSON.stringify(result, null, 2);
  }

  //metodo toString para imprimir cada producto
  toString(prod: ProductWithId): string {
    let result: string = "\n";
    for (let propiedad in prod) {
      result += `${propiedad}: ${prod[propiedad]}\n`;
    }
    return result;
  }

  //metodo para imprimir por consola todos los productos
  async printProducts() {
    try {
      const products: ProductWithId[] = await this.getProducts();
      let result: string =
        "\n---------------------------\nListado de productos:\n---------------------------\n";
      //recorro el array de productos y ejecuto el toString para cada producto
      products.forEach((prod: ProductWithId) => {
        result += this.toString(prod);
      });
      return result + "\n---------------------------";
    } catch (error) {
      return `Error: ${error}`;
    }
  }
}

//------------------------------------------------------probando el codigo
const prueba = async () => {
  const listadoProductos = new ProductManager();

  await listadoProductos.addProduct({
    title: "Producto 1",
    description: "Este es el primer producto",
    price: 1000,
    thumbnail: "productoC1.png",
    code: "c1",
    stock: 100,
  });

  await listadoProductos.addProduct({
    title: "Producto 2",
    description: "Este es el segundo producto",
    price: 2000,
    thumbnail: "productoC2.png",
    code: "c2",
    stock: 150,
  });

  await listadoProductos.addProduct({
    title: "Producto 3",
    description: "Este es el tercer producto",
    price: 1200,
    thumbnail: "productoC3.png",
    code: "c1",
    stock: 130,
  });

  await listadoProductos.addProduct({
    title: "Producto 4",
    description: "Este es el cuarto producto",
    price: 1400,
    thumbnail: "productoC4.png",
    code: "c4",
    stock: 180,
  });

  console.log(await listadoProductos.printProducts());

  console.table(await listadoProductos.getProductById(2));
  console.table(await listadoProductos.getProductById(5));
};
prueba();
