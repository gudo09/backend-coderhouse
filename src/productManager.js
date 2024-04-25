import { promises as fs } from "fs";
import config from "./config.js";
//creo la clase ProductManager que es la que va a crear instancias
class ProductManager {
    products;
    path = "";
    id = 1;
    idPath = "";
    // metodo que permite ejecutar funciones asincronas en el constructor
    async init() {
        this.id = await this.getId();
    }
    //la llamada al constuctor genera un array vacio a inicializa el path con la direccione en donde se guardará el archivo json
    constructor() {
        this.products = [];
        this.path = `${config.DIRNAME}/products.json`;
        this.idPath = `${config.DIRNAME}/ProductNextId.txt`;
        this.init();
    }
    //creo el metodo addProduct que va a recibir un elemento del tipo Product y lo agrega al products.json
    //el metodo es de tipo void porque no retorna nada
    async addProduct(product) {
        //le agrego un id al nuevo producto
        const newProductWithId = { id: this.id, ...product };
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
    async getProducts(limit) {
        const importProducts = await fs.readFile(this.path, "utf-8");
        const products = importProducts
            ? JSON.parse(importProducts)
            : [];
        return limit === 0 ? products : products.slice(0, limit);
    }
    //el metodo es de tipo Promise<string> porque retorna un mensaje por consola
    //recibe un id como parametro y devuelve un mensaje (ya sea que se haya encontrado o no)
    async getProductById(id) {
        await this.updateArrayProducts();
        // busco el producto y lo devuelvo
        const result = this.products.find((prod) => id === prod.id);
        return result;
    }
    //el metodo deteleProduct recibe un id y elimila el producto con ese id
    async deteleProduct(id) {
        //elimino el producto del arreglo, actualizo el json y devuelvo mensaje
        this.products = this.products.filter((prod) => prod.id !== id);
        //escribo el arreglo actualizado en el json
        await this.updateJson();
        return `El producto con el id ${id} se ha eliminado`;
    }
    //updateProduct recube un id y un objeto de tipo Product para actualizar el producto con dicho id
    async updateProduct(id, updatedProduct) {
        await this.updateArrayProducts();
        //elimino el producto con ese id del arreglo
        this.products = this.products.filter((prod) => prod.id !== id);
        //agrego el producto actualizado con ese id al arreglo y actualizo el json
        this.products.push({ id: id, ...updatedProduct });
        await this.updateJson();
        return { id: id, ...updatedProduct };
    }
    //metodo toString para imprimir cada producto
    toString(prod) {
        let result = "\n";
        for (let propiedad in prod) {
            result += `${propiedad}: ${prod[propiedad]}\n`;
        }
        return result;
    }
    //actualiza el array de productos con lo que hay en el json
    async updateArrayProducts() {
        this.products = await this.getProducts(0);
    }
    //metodo para buscar si hay algun producto con alguna propiedad y valor en especifico
    async isSomeProductWith(propertyName, propertyValue) {
        await this.updateArrayProducts();
        return this.products.some((product) => propertyValue === product[propertyName]);
    }
    //metodo para imprimir por consola todos los productos
    async printProducts() {
        try {
            await this.updateArrayProducts();
            let result = "\n---------------------------\nListado de productos:\n---------------------------\n";
            //recorro el array de productos y ejecuto el toString para cada producto
            this.products.forEach((prod) => {
                result += this.toString(prod);
            });
            return result + "\n---------------------------";
        }
        catch (error) {
            return `Error: ${error}`;
        }
    }
    //metodo para actualizar el archivo json
    async updateJson() {
        await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
    }
    async getId() {
        //obtengo el id del archivo txt
        const lastId = parseInt(await fs.readFile(this.idPath, "utf-8"));
        return lastId;
    }
    async setId() {
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
