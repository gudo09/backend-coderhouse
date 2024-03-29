"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//creo el ripo Product con los datos necesarios
const util_1 = require("util");
class ProductManager {
    constructor() {
        this.id = 1;
        this.products = [];
    }
    //creo el metodo addProduct que va a recibir un elemento del tipo Producty lo agrega al arreglo Products[]
    //el metodo es de tipo void porque no retorna nada
    addProduct(product) {
        //le agrego un id al nuevo producto
        const newProductWithId = Object.assign({ id: this.id }, product);
        //Valido si la propiedad code se repite en algun otro producto
        const duplicatedCode = this.products.some((product) => product.code === newProductWithId.code);
        //Si está diplicado muestro un mensaje por consola
        if (duplicatedCode) {
            console.log(`\nEl código ${newProductWithId.code} ya existe en otro producto, no se pudo agregar el producto con el título ${(0, util_1.inspect)(newProductWithId.title, {})}`);
            return;
        }
        this.products.push(newProductWithId);
        //aumento el id para el siguiente producto
        this.id++;
    }
    //el metodo es de tipo ProductWithId[] porque retorna un arreglo con los productos y su id
    getProducts() {
        return this.products;
    }
    //el metodo es de tipo ProductWithId[] porque retorna un arreglo con los productos y su id
    getProductById(id) {
        const result = this.products.find((prod) => id === prod.id);
        if (result === undefined)
            return `\nNo se ha encontrado el producto con el ID ${id}`;
        return `\nSe ha encontrado un producto con el id ${id}\n${JSON.stringify(result)}`;
    }
}
const listadoProductos = new ProductManager();
listadoProductos.addProduct({
    title: "Producto 1",
    description: "Este es el primer producto",
    price: 1000,
    thumbnail: "productoC1.png",
    code: "c1",
    stock: 100,
});
listadoProductos.addProduct({
    title: "Producto 2",
    description: "Este es el segundo producto",
    price: 2000,
    thumbnail: "productoC2.png",
    code: "c2",
    stock: 150,
});
listadoProductos.addProduct({
    title: "Producto 3",
    description: "Este es el tercer producto",
    price: 1200,
    thumbnail: "productoC3.png",
    code: "c1",
    stock: 130,
});
listadoProductos.addProduct({
    title: "Producto 4",
    description: "Este es el cuarto producto",
    price: 1400,
    thumbnail: "productoC4.png",
    code: "c4",
    stock: 180,
});
console.log(listadoProductos.getProducts());
console.table(listadoProductos.getProductById(2));
console.table(listadoProductos.getProductById(5));
