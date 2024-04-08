"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
//creo la clase ProductManager que es la que va a crear instancias
var ProductManager = /** @class */ (function () {
    //la llamada al constuctor genera un array vacio a inicializa el path con la direccione en donde se guardará el archivo json
    function ProductManager() {
        this.path = "";
        this.id = 1;
        this.products = [];
        this.path = "./src/products.json";
        fs_1.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
    }
    //creo el metodo addProduct que va a recibir un elemento del tipo Product y lo agrega al products.json
    //el metodo es de tipo void porque no retorna nada
    ProductManager.prototype.addProduct = function (product) {
        return __awaiter(this, void 0, void 0, function () {
            var newProductWithId, duplicatedCode, duplicatedId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newProductWithId = __assign({ id: this.id }, product);
                        //actualizo el arreglo products de la clase
                        return [4 /*yield*/, this.updateArrayProducts()];
                    case 1:
                        //actualizo el arreglo products de la clase
                        _a.sent();
                        duplicatedCode = this.isSomeProductWith("code", newProductWithId.code);
                        //Si está diplicado muestro un mensaje por consola y salgo del metodo
                        if (duplicatedCode) {
                            console.log("\nEl c\u00F3digo ".concat(newProductWithId.code, " ya existe en otro producto, no se pudo agregar el producto con el t\u00EDtulo '").concat(newProductWithId.title, "'"));
                            return [2 /*return*/];
                        }
                        if (this.products.length !== 0) {
                            duplicatedId = true;
                            while (duplicatedId === true) {
                                duplicatedId = this.isSomeProductWith("id", this.id);
                                duplicatedId && this.id++;
                            }
                        }
                        //Si no está repetido, lo agrego al arreglo products y guardo en el archivo json
                        this.products.push(newProductWithId);
                        return [4 /*yield*/, fs_1.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))];
                    case 2:
                        _a.sent();
                        //aumento el id para el siguiente producto
                        this.id++;
                        return [2 /*return*/];
                }
            });
        });
    };
    //el metodo es de tipo Promise<ProductWithId[]> porque retorna una promesa de un arreglo con los productos y su respectivos id
    ProductManager.prototype.getProducts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var importProducts, products;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs_1.promises.readFile(this.path, "utf-8")];
                    case 1:
                        importProducts = _a.sent();
                        products = JSON.parse(importProducts);
                        return [2 /*return*/, products];
                }
            });
        });
    };
    //el metodo es de tipo Promise<string> porque retorna un mensaje por consola
    ProductManager.prototype.getProductById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateArrayProducts()];
                    case 1:
                        _a.sent();
                        result = this.products.find(function (prod) { return id === prod.id; });
                        if (result === undefined)
                            return [2 /*return*/, "\nNo se ha encontrado el producto con el ID ".concat(id)];
                        return [2 /*return*/, "\nSe ha encontrado un producto con el id ".concat(id, ":\n").concat(this.toString(result))];
                }
            });
        });
    };
    //el metodo deteleProduct recibe un id y elimila el producto con ese id
    ProductManager.prototype.deteleProduct = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var someProductId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        someProductId = this.isSomeProductWith("id", id);
                        //si no hay producto con el id buscado, devuelvo mensaje
                        if (!someProductId)
                            return [2 /*return*/, "\nNo se ha encontrado producto con el id ".concat(id, " para eliminar.")];
                        //si hay producto con el id buscado, lo elimino del arreglo, actualizo el json y devuelvo mensaje
                        this.products = this.products.filter(function (prod) { return prod.id !== id; });
                        return [4 /*yield*/, fs_1.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, "\nEl producto con el id ".concat(id, " se ha eliminado")];
                }
            });
        });
    };
    //metodo toString para imprimir cada producto
    ProductManager.prototype.toString = function (prod) {
        var result = "\n";
        for (var propiedad in prod) {
            result += "".concat(propiedad, ": ").concat(prod[propiedad], "\n");
        }
        return result;
    };
    ProductManager.prototype.updateProduct = function (id, updatedProduct) {
        return __awaiter(this, void 0, void 0, function () {
            var existsProductWithId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateArrayProducts()];
                    case 1:
                        _a.sent();
                        existsProductWithId = this.isSomeProductWith("id", id);
                        if (!existsProductWithId)
                            return [2 /*return*/, "\nEl producto con el id ".concat(id, " no existe para actualizarse.")];
                        this.products = this.products.filter(function (prod) { return prod.id !== id; });
                        this.products.push(__assign({ id: id }, updatedProduct));
                        return [4 /*yield*/, fs_1.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, "\nEl producto con el id ".concat(id, " ha sido actualizado")];
                }
            });
        });
    };
    ProductManager.prototype.updateArrayProducts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.getProducts()];
                    case 1:
                        _a.products = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProductManager.prototype.isSomeProductWith = function (propertyName, propertyValue) {
        return this.products.some(function (product) { return propertyValue === product[propertyName]; });
    };
    //metodo para imprimir por consola todos los productos
    ProductManager.prototype.printProducts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result_1, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.updateArrayProducts()];
                    case 1:
                        _a.sent();
                        result_1 = "\n---------------------------\nListado de productos:\n---------------------------\n";
                        //recorro el array de productos y ejecuto el toString para cada producto
                        this.products.forEach(function (prod) {
                            result_1 += _this.toString(prod);
                        });
                        return [2 /*return*/, result_1 + "\n---------------------------"];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/, "Error: ".concat(error_1)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ProductManager;
}());
//------------------------------------------------------probando el codigo
var prueba = function () { return __awaiter(void 0, void 0, void 0, function () {
    var listadoProductos, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    return __generator(this, function (_s) {
        switch (_s.label) {
            case 0:
                listadoProductos = new ProductManager();
                return [4 /*yield*/, listadoProductos.addProduct({
                        title: "Producto 1",
                        description: "Este es el primer producto",
                        price: 1000,
                        thumbnail: "productoC1.png",
                        code: "c1",
                        stock: 100,
                    })];
            case 1:
                _s.sent();
                return [4 /*yield*/, listadoProductos.addProduct({
                        title: "Producto 2",
                        description: "Este es el segundo producto",
                        price: 2000,
                        thumbnail: "productoC2.png",
                        code: "c2",
                        stock: 150,
                    })];
            case 2:
                _s.sent();
                return [4 /*yield*/, listadoProductos.addProduct({
                        title: "Producto 3",
                        description: "Este es el tercer producto",
                        price: 1200,
                        thumbnail: "productoC3.png",
                        code: "c1",
                        stock: 130,
                    })];
            case 3:
                _s.sent();
                return [4 /*yield*/, listadoProductos.addProduct({
                        title: "Producto 4",
                        description: "Este es el cuarto producto",
                        price: 1400,
                        thumbnail: "productoC4.png",
                        code: "c4",
                        stock: 180,
                    })];
            case 4:
                _s.sent();
                _b = (_a = console).log;
                return [4 /*yield*/, listadoProductos.printProducts()];
            case 5:
                _b.apply(_a, [_s.sent()]);
                _d = (_c = console).table;
                return [4 /*yield*/, listadoProductos.getProductById(2)];
            case 6:
                _d.apply(_c, [_s.sent()]);
                _f = (_e = console).table;
                return [4 /*yield*/, listadoProductos.getProductById(5)];
            case 7:
                _f.apply(_e, [_s.sent()]);
                _h = (_g = console).log;
                return [4 /*yield*/, listadoProductos.deteleProduct(2)];
            case 8:
                _h.apply(_g, [_s.sent()]);
                return [4 /*yield*/, listadoProductos.addProduct({
                        title: "Producto 5",
                        description: "Este es el quinto producto",
                        price: 1500,
                        thumbnail: "productoC4.png",
                        code: "c5",
                        stock: 280,
                    })];
            case 9:
                _s.sent();
                _k = (_j = console).log;
                return [4 /*yield*/, listadoProductos.printProducts()];
            case 10:
                _k.apply(_j, [_s.sent()]);
                _m = (_l = console).log;
                return [4 /*yield*/, listadoProductos.updateProduct(4, {
                        title: "Producto 4",
                        description: "Este es el cuarto producto PERO ESTÁ ACTUALIZADO",
                        price: 1400,
                        thumbnail: "productoC4.png",
                        code: "c4",
                        stock: 180,
                    })];
            case 11:
                _m.apply(_l, [_s.sent()]);
                _p = (_o = console).log;
                return [4 /*yield*/, listadoProductos.updateProduct(6, {
                        title: "Producto 4",
                        description: "Este es el cuarto producto PERO ESTÁ ACTUALIZADO",
                        price: 1400,
                        thumbnail: "productoC4.png",
                        code: "c4",
                        stock: 180,
                    })];
            case 12:
                _p.apply(_o, [_s.sent()]);
                _r = (_q = console).log;
                return [4 /*yield*/, listadoProductos.printProducts()];
            case 13:
                _r.apply(_q, [_s.sent()]);
                return [2 /*return*/];
        }
    });
}); };
prueba();
