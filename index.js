"use strict";
//creo la clase ProductManager que es la que va a crear instancias
class ProductManager {
    //la llamada al constuctor genera un array vacio
    constructor() {
        this.id = 1;
        this.products = [];
    }
    //creo el metodo addProduct que va a recibir un elemento del tipo Product y lo agrega al arreglo Products[]
    //el metodo es de tipo void porque no retorna nada
    addProduct(product) {
        //le agrego un id al nuevo producto
        const newProductWithId = Object.assign({ id: this.id }, product);
        //Valido si la propiedad code se repite en algun otro producto
        const duplicatedCode = this.products.some((product) => product.code === newProductWithId.code);
        //Si está diplicado muestro un mensaje por consola
        if (duplicatedCode) {
            console.log(`\nEl código ${newProductWithId.code} ya existe en otro producto, no se pudo agregar el producto con el título '${newProductWithId.title}'`);
            return;
        }
        this.products.push(newProductWithId);
        //aumento el id para el siguiente producto
        this.id++;
    }
    //el metodo es de tipo ProductWithId[] porque retorna un arreglo con los productos y su id
    getProducts() {
        let result = "\n---------------------------\nListado de productos:\n---------------------------\n";
        //recorro el array de productos y ejecuto el toString para cada producto
        this.products.forEach((prod) => {
            result += this.toString(prod);
        });
        return result + "\n---------------------------";
    }
    //el metodo es de tipo ProductWithId[] porque retorna un arreglo con los productos y su id
    getProductById(id) {
        const result = this.products.find((prod) => id === prod.id);
        if (result === undefined)
            return `\nNo se ha encontrado el producto con el ID ${id}`;
        return `\nSe ha encontrado un producto con el id ${id}:\n${this.toString(result)}`;
    }
    //metodo toString para imprimir cada producto
    toString(prod) {
        let result = "\n";
        for (let propiedad in prod) {
            result += `${propiedad}: ${prod[propiedad]}\n`;
        }
        return result;
    }
}
//probando el codigo
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
