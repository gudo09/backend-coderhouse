## Aclaraciones para la entrega:
  - El método getProducts está implementado dentro de la clase pero lo reutilizo en otras partes de mi código para actualizar el arreglo products por lo que para imprimir por consola creé el método printProducts()


### Scripts NPM:
  - "start": Hace un watch del archivo app.js ya compilado.
  - "watch-js": Modo watch para todos los archivos .ts y los compila a .js en tiempo real.
  - "build": Compila todos los archivos .ts en .js.
  - "dev-tsnd": watch para desarrollar sólo en ts sin compilar a js


Resumen entrega 1 proyecto final:

✅ Inicializar servidor Express.

✅ Agregar config json y urlencoded.

- Colocar rutas en archivos separados, utilizando Router.

- archivo rutas productos (products.routes.js).

- archivo rutas carritos (carts.routes.js).

products.routes.js (5 endpoints):

✅ GET / -> retornar todos los productos.

✅ debe aceptar parámetro limit tipo query.

✅ GET /:pid -> retornar solo el producto que coincide con pid.

- POST / -> agregar un nuevo producto con los datos del req.body.

- id debe autogenerarse sin repetirse (usar contador, no hace falta más).

- thumbnails: array con nombres de archivos de fotos del producto.

- todos obligatorios excepto thumbnails, es decir que el uso de Multer es OPCIONAL en este caso.

- PUT /:pid -> editar producto con id pid, según datos en el req.body.

- nunca modificar id.

- DELETE /:pid -> borrar producto con id pid.

carts.routes.js (3 endpoints):

- GET /:cid -> retornar listado de productos del carrito con id cid.

- POST / -> crear carrito nuevo.

- id autogenerado.

- products: array vacío.

- POST /:cid/product/:pid -> agregar producto con id pid al carrito con id cid.

- debe agregar un item al array products del carrito, con solo el id del producto y una propiedad quantity (por ahora en 1).

- verificar si el id de producto ya está en el array products, en ese caso sumarle 1.

Generales:

- Crear archivos products.json y carts.json con algunos datos random para prueba (no hacen falta muchos, solo algunos para testear).

- Cargar arrays desde archivos.

- Procesar sobre los arrays en los endpoins, luego actualizan archivos con contenidos de arrays.

✅ Publicar a repo Github SIN node_modules (agregar node_modules/ a archivo .gitignore).