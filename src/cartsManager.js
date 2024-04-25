import { promises as fs } from "fs";
import config from "./config.js";
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
        // uso map para recorrer el carrito y actualizarlo
        this.carts.map(cart => {
            //busco el carrito con el id en cuestion
            if (cart.id === cartId) {
                // busco si existe el producto con el id en cuestion
                const findProduct = cart.products.find((product) => product.id === productId);
                findProduct
                    //si lo encuentro y su quantity es undefined, lo igualo a 0 y le sumo 1
                    ? findProduct.quantity = (findProduct.quantity || 0) + 1
                    // si no lo encuentro lo agrego al arreglo de productos
                    : cart.products.push({ id: productId, quantity: 1 });
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
