var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
//creo la clase ProductManager que es la que va a crear instancias
var ProductManager = /** @class */ (function () {
    //la llamada al constuctor genera un array vacio
    function ProductManager() {
        this.id = 1;
        this.products = [];
    }
    //creo el metodo addProduct que va a recibir un elemento del tipo Product y lo agrega al arreglo Products[]
    //el metodo es de tipo void porque no retorna nada
    ProductManager.prototype.addProduct = function (product) {
        //le agrego un id al nuevo producto
        var newProductWithId = __assign({ id: this.id }, product);
        //Valido si la propiedad code se repite en algun otro producto
        var duplicatedCode = this.products.some(function (product) { return product.code === newProductWithId.code; });
        //Si está diplicado muestro un mensaje por consola
        if (duplicatedCode) {
            console.log("\nEl c\u00F3digo ".concat(newProductWithId.code, " ya existe en otro producto, no se pudo agregar el producto con el t\u00EDtulo '").concat(newProductWithId.title, "'"));
            return;
        }
        this.products.push(newProductWithId);
        //aumento el id para el siguiente producto
        this.id++;
    };
    //el metodo es de tipo ProductWithId[] porque retorna un arreglo con los productos y su id
    ProductManager.prototype.getProducts = function () {
        var _this = this;
        var result = "\n---------------------------\nListado de productos:\n---------------------------\n";
        //recorro el array de productos y ejecuto el toString para cada producto
        this.products.forEach(function (prod) {
            result += _this.toString(prod);
        });
        return result + "\n---------------------------";
    };
    //el metodo es de tipo ProductWithId[] porque retorna un arreglo con los productos y su id
    ProductManager.prototype.getProductById = function (id) {
        var result = this.products.find(function (prod) { return id === prod.id; });
        if (result === undefined)
            return "\nNo se ha encontrado el producto con el ID ".concat(id);
        return "\nSe ha encontrado un producto con el id ".concat(id, ":\n").concat(this.toString(result));
    };
    //metodo toString para imprimir cada producto
    ProductManager.prototype.toString = function (prod) {
        var result = "\n";
        for (var propiedad in prod) {
            result += "".concat(propiedad, ": ").concat(prod[propiedad], "\n");
        }
        return result;
    };
    return ProductManager;
}());
//------------------------------------------------------probando el codigo
var listadoProductos = new ProductManager();
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
