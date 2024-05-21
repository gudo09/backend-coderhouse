import { promises as fs } from "fs";
import config from "../../config.js";
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
        this.path = `${config.DIRNAME}/dao/managers/products.json`;
        this.idPath = `${config.DIRNAME}/dao/managers/ProductNextId.txt`;
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
        // si el json esta vacío le asigno un []
        const products = importProducts
            ? JSON.parse(importProducts)
            : [];
        return limit === 0 ? products : products.slice(0, limit);
    }
    //recibe un id como parametro y devuelve el producto, o undefined si no lo encontró
    async getProductById(id) {
        await this.updateArrayProducts();
        // busco el producto y lo devuelvo
        const result = this.products.find((prod) => id === prod.id);
        return result;
    }
    async getLastProductAdded() {
        const lastProduct = this.products[this.products.length - 1];
        return lastProduct;
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
