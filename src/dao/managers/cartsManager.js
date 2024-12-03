import { promises as fs } from "fs";
import config from "../../config.js";
class cartsManager {
    carts;
    path;
    id = 1;
    idPath;
    // metodo que permite ejecutar funciones asincronas en el constructor
    async init() {
        this.id = await this.getId();
    }
    constructor() {
        this.carts = [];
        this.path = `${config.DIRNAME}/dao/managers/carts.json`;
        this.idPath = `${config.DIRNAME}/dao/managers/CartNextId.txt`;
        this.init();
    }
    //creo el metodo addCart que va a recibir un elemento del tipo Cart y lo agrega al carts.json
    //el metodo es de tipo void porque no retorna nada
    async addCart(cart) {
        //le agrego un id al nuevo carrito
        const newCartWithId = { id: this.id, ...cart };
        //actualizo el arreglo carts de la clase
        await this.updateArrayCarts();
        this.carts.push(newCartWithId);
        await this.updateJson();
        //aumento el id para el siguiente carrito
        this.setId();
    }
    async getId() {
        //obtengo el id del archivo txt
        const lastId = parseInt(await fs.readFile(this.idPath, "utf-8"));
        return lastId;
    }
    async setId() {
        //incremento el id del array de carts y lo guardo en el txt del id
        this.id++;
        await fs.writeFile(this.idPath, JSON.stringify(this.id));
    }
    //metodo para actualizar el archivo json
    async updateJson() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }
    //el metodo es de tipo Promise<CartWithId[]> porque retorna una promesa de un arreglo con los carts y su respectivos id
    async getCarts(limit) {
        const importCarts = await fs.readFile(this.path, "utf-8");
        // si el json esta vacío le asigno un []
        const carts = importCarts ? JSON.parse(importCarts) : [];
        return limit === 0 ? carts : carts.slice(0, limit);
    }
    //actualiza el array de productos con lo que hay en el json
    async updateArrayCarts() {
        this.carts = await this.getCarts(0);
    }
    //metodo para buscar si hay algun carrito con alguna propiedad y valor en especifico
    async isSomeCartWith(propertyName, propertyValue) {
        await this.updateArrayCarts();
        return this.carts.some((cart) => propertyValue === cart[propertyName]);
    }
    //recibe un id como parametro y devuelve el carrito, o undefined si no lo encontró
    async getCartById(id) {
        await this.updateArrayCarts();
        // busco el carrito y lo devuelvo
        const result = this.carts.find((cart) => id === cart.id);
        return result;
    }
    // recibe un id de producto y un id de carrito y agrega una unidad de ese producto a ese carrito
    async addProductToCart(productId, cartId) {
        // uso map para recorrer el carrito y actualizarlo
        this.carts.map((cart) => {
            //busco el carrito con el id en cuestion
            if (cart.id === cartId) {
                // busco si existe el producto con el id en cuestion
                const findProduct = cart.products.find((product) => product.id === productId);
                findProduct
                    ? //si lo encuentro y su quantity es undefined, lo igualo a 0 y le sumo 1
                        (findProduct.quantity = (findProduct.quantity || 0) + 1)
                    : // si no lo encuentro lo agrego al arreglo de productos
                        cart.products.push({ id: productId, quantity: 1 });
            }
            else {
                //si no es el carrito que busco, lo retorno tal como está
                return cart;
            }
        });
        //console.log(JSON.stringify(this.carts, null,2))
        //this.carts.push(updatedProducts as unknown as CartWithId);
        this.updateJson();
    }
}
export default cartsManager;
