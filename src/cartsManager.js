import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import config from "./config.js";
//obtengo la ruta absoluta de este archivo para leer de forma relativa al products.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
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
        this.path = `${config.DIRNAME}/carts.json`;
        this.idPath = `${config.DIRNAME}/CartNextId.txt`;
        this.init();
    }
    //creo el metodo addProduct que va a recibir un elemento del tipo Product y lo agrega al products.json
    //el metodo es de tipo void porque no retorna nada
    async addCart(cart) {
        //le agrego un id al nuevo producto
        const newCartWithId = { id: this.id, ...cart };
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
    //metodo para actualizar el archivo json
    async updateJson() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }
    //el metodo es de tipo Promise<ProductWithId[]> porque retorna una promesa de un arreglo con los productos y su respectivos id
    async getCarts(limit) {
        const importCarts = await fs.readFile(this.path, "utf-8");
        // si el json esta vacío lo creo con un []
        const carts = importCarts ? JSON.parse(importCarts) : [];
        return limit === 0 ? carts : carts.slice(0, limit);
    }
    //actualiza el array de productos con lo que hay en el json
    async updateArrayCarts() {
        this.carts = await this.getCarts(0);
    }
    //metodo para buscar si hay algun producto con alguna propiedad y valor en especifico
    async isSomeCartWith(propertyName, propertyValue) {
        await this.updateArrayCarts();
        return this.carts.some((cart) => propertyValue === cart[propertyName]);
    }
    //el metodo es de tipo Promise<string> porque retorna un mensaje por consola
    //recibe un id como parametro y devuelve un mensaje (ya sea que se haya encontrado o no)
    async getCartById(id) {
        await this.updateArrayCarts();
        // busco el producto y lo devuelvo
        const result = this.carts.find((cart) => id === cart.id);
        return result;
    }
    async addProductToCart(productId, cartId) {
        const cartToModify = await this.getCartById(cartId);
        //console.log(cartToModify)
        let updatedProducts = [];
        const isInCart = cartToModify.products.find((prod) => prod.id === productId);
        if (!isInCart) {
            cartToModify.products.push({
                id: productId,
                quantity: 1,
            });
            updatedProducts = cartToModify;
        }
        else {
            updatedProducts = cartToModify.products.map((prod) => {
                if (prod.id === productId) {
                    if (prod.quantity === undefined)
                        prod.quantity = 0;
                    return { quantity: prod.quantity + 1, ...prod };
                }
                else {
                    return prod;
                }
            });
        }
        //console.log(cartToModify)
        this.carts = this.carts.filter((cart) => cart.id !== cartId);
        this.carts.push(updatedProducts);
        this.updateJson();
    }
}
export default cartsManager;
