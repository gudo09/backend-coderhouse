"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
//creo la clase ProductManager que es la que va a crear instancias
class ProductManager {
    //la llamada al constuctor genera un array vacio a inicializa el path con la direccione en donde se guardará el archivo json
    constructor() {
        this.path = "";
        this.id = 1;
        this.products = [];
        this.path = "./src/products.json";
        fs_1.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
    }
    //creo el metodo addProduct que va a recibir un elemento del tipo Product y lo agrega al products.json
    //el metodo es de tipo void porque no retorna nada
    async addProduct(product) {
        //le agrego un id al nuevo producto
        const newProductWithId = { id: this.id, ...product };
        //actualizo el arreglo products de la clase
        await this.updateArrayProducts();
        //Valido si la propiedad code se repite en algun otro producto
        const duplicatedCode = this.products.some((product) => product.code === newProductWithId.code);
        //Si está diplicado muestro un mensaje por consola y salgo del metodo
        if (duplicatedCode) {
            console.log(`\nEl código ${newProductWithId.code} ya existe en otro producto, no se pudo agregar el producto con el título '${newProductWithId.title}'`);
            return;
        }
        if (this.products.length !== 0) {
            //Valido el id del producto a agregar para que no se repita
            let duplicatedId = true;
            while (duplicatedId === true) {
                duplicatedId = this.products.some((product) => product.id === this.id);
                duplicatedId && this.id++;
            }
        }
        //Si no está repetido, lo agrego al arreglo products y guardo en el archivo json
        this.products.push(newProductWithId);
        await fs_1.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
        //aumento el id para el siguiente producto
        this.id++;
    }
    //el metodo es de tipo Promise<ProductWithId[]> porque retorna una promesa de un arreglo con los productos y su respectivos id
    async getProducts() {
        const importProducts = await fs_1.promises.readFile(this.path, "utf-8");
        const products = JSON.parse(importProducts);
        return products;
    }
    //el metodo es de tipo Promise<string> porque retorna un mensaje por consola
    async getProductById(id) {
        await this.updateArrayProducts();
        const result = this.products.find((prod) => id === prod.id);
        if (result === undefined)
            return `\nNo se ha encontrado el producto con el ID ${id}`;
        return `\nSe ha encontrado un producto con el id ${id}:\n${this.toString(result)}`;
        //return JSON.stringify(result, null, 2);
    }
    //el metodo deteleProduct recibe un id y elimila el producto con ese id
    async deteleProduct(id) {
        //busco si hay algun producto con el id a eliminar
        const someProductId = this.products.some((prod) => prod.id === id);
        //si no hay producto con el id buscado, devuelvo mensaje
        if (!someProductId)
            return `\nNo se ha encontrado producto con el id ${id} para eliminar.`;
        //si hay producto con el id buscado, lo elimino del arreglo, actualizo el json y devuelvo mensaje
        this.products = this.products.filter((prod) => prod.id !== id);
        await fs_1.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
        return `\nEl producto con el id ${id} se ha eliminado`;
    }
    //metodo toString para imprimir cada producto
    toString(prod) {
        let result = "\n";
        for (let propiedad in prod) {
            result += `${propiedad}: ${prod[propiedad]}\n`;
        }
        return result;
    }
    async updateArrayProducts() {
        this.products = await this.getProducts();
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
};
prueba();
