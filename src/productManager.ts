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
    this.path = "src/products.json";
    this.idPath = "src/id.txt";
    this.init();
  }

  //creo el metodo addProduct que va a recibir un elemento del tipo Product y lo agrega al products.json
  //el metodo es de tipo void porque no retorna nada
  async addProduct(product: Product): Promise<void> {
    //le agrego un id al nuevo producto
    const newProductWithId: ProductWithId = { id: this.id, ...product };

    //actualizo el arreglo products de la clase
    await this.updateArrayProducts();

    //Valido si la propiedad code se repite en algun otro producto
    const duplicatedCode: boolean = this.isSomeProductWith(
      "code",
      newProductWithId.code
    );

    //Si está diplicado muestro un mensaje por consola y salgo del metodo
    if (duplicatedCode) {
      console.log(
        `\nEl código ${newProductWithId.code} ya existe en otro producto, no se pudo agregar el producto con el título '${newProductWithId.title}'`
      );
      return;
    }

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

    //Si no está repetido, lo agrego al arreglo products y actualizo el archivo json
    this.products.push(newProductWithId);
    await this.updateJson();

    //aumento el id para el siguiente producto
    this.setId();
  }

  //el metodo es de tipo Promise<ProductWithId[]> porque retorna una promesa de un arreglo con los productos y su respectivos id
  async getProducts(limit: number): Promise<ProductWithId[]> {
    const importProducts: string = await fs.readFile(this.path, "utf-8");
    const products: ProductWithId[] = JSON.parse(importProducts);
    return limit === 0 ? products : products.slice(0, limit);
  }

  //el metodo es de tipo Promise<string> porque retorna un mensaje por consola
  //recibe un id como parametro y devuelve un mensaje (ya sea que se haya encontrado o no)
  async getProductById(id: number): Promise<string | ProductWithId> {
    await this.updateArrayProducts();
    const result: ProductWithId | undefined = this.products.find(
      (prod: ProductWithId) => id === prod.id
    );
    if (result === undefined)
      return `\nNo se ha encontrado el producto con el ID ${id}`;
    return result;

    //return JSON.stringify(result, null, 2);
  }

  //el metodo deteleProduct recibe un id y elimila el producto con ese id
  async deteleProduct(id: number): Promise<string> {
    //busco si hay algun producto con el id a eliminar
    const someProductId: boolean = this.isSomeProductWith("id", id);

    //si no hay producto con el id buscado, devuelvo mensaje
    if (!someProductId)
      return `\nNo se ha encontrado producto con el id ${id} para eliminar.`;

    //si hay producto con el id buscado, lo elimino del arreglo, actualizo el json y devuelvo mensaje
    this.products = this.products.filter(
      (prod: ProductWithId) => prod.id !== id
    );

    //escribo el arreglo actualizado en el json
    await this.updateJson();
    return `\nEl producto con el id ${id} se ha eliminado`;
  }

  //metodo toString para imprimir cada producto
  toString(prod: ProductWithId): string {
    let result: string = "\n";
    for (let propiedad in prod) {
      result += `${propiedad}: ${prod[propiedad]}\n`;
    }
    return result;
  }

  //updateProduct recube un id y un objeto de tipo Product para actualizar el producto con dicho id
  async updateProduct(id: number, updatedProduct: Product): Promise<string> {
    await this.updateArrayProducts();

    //verifico si existe un producto con ese id en el arreglo de productos
    const existsProductWithId = this.isSomeProductWith("id", id);

    //si no existe muestro un mensaje de que no se pudo actualizar
    if (!existsProductWithId)
      return `\nEl producto con el id ${id} no existe para actualizarse.`;

    //elimino el producto con ese id del arreglo
    this.products = this.products.filter(
      (prod: ProductWithId) => prod.id !== id
    );

    //agrego el producto actualizado con ese id al arreglo y actualizo el json
    this.products.push({ id: id, ...updatedProduct });
    await this.updateJson();
    return `\nEl producto con el id ${id} ha sido actualizado`;
  }

  //actualiza el array de productos con lo que hay en el json
  async updateArrayProducts(): Promise<void> {
    this.products = await this.getProducts(0);
  }

  //metodo para buscar si hay algun producto con alguna propiedad y valor en especifico
  isSomeProductWith(propertyName: string, propertyValue: any): boolean {
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

//------------------------------------------------------probando el codigo
/*
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
  console.log(await listadoProductos.deteleProduct(2));

  await listadoProductos.addProduct({
    title: "Producto 5",
    description: "Este es el quinto producto",
    price: 1500,
    thumbnail: "productoC4.png",
    code: "c5",
    stock: 280,
  });

  console.log(await listadoProductos.printProducts());
  console.log(await listadoProductos.updateProduct(4,{
    title: "Producto 4",
    description: "Este es el cuarto producto PERO ESTÁ ACTUALIZADO",
    price: 1400,
    thumbnail: "productoC4.png",
    code: "c4",
    stock: 180,
  }))

  console.log(await listadoProductos.updateProduct(6,{
    title: "Producto 4",
    description: "Este es el cuarto producto PERO ESTÁ ACTUALIZADO",
    price: 1400,
    thumbnail: "productoC4.png",
    code: "c4",
    stock: 180,
  }))

  console.log(await listadoProductos.printProducts());
};
prueba();
*/
