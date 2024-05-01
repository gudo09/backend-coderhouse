## Aclaraciones para la entrega:
  - El método getProducts está implementado dentro de la clase pero lo reutilizo en otras partes de mi código para actualizar el arreglo products por lo que para imprimir por consola creé el método printProducts()


### Scripts NPM:
  - "start": Hace un watch del archivo app.js ya compilado.
  - "watch-js": Modo watch para todos los archivos .ts y los compila a .js en tiempo real.
  - "build": Compila todos los archivos .ts en .js.
  - "dev-tsnd": watch para desarrollar sólo en ts sin compilar a js


Resumen entrega desafìo 4:

Configurar nuestro proyecto para que trabaje con Handlebars y Websocket.

- Aspectos a incluir

    ✅ Configurar el servidor para integrar el motor de plantillas Handlebars. 
    
    - Instalar un servidor de socket.io al mismo.

    ✅ Crear una vista “home.handlebars” la cual contenga una lista de todos los productos agregados hasta el momento

    ✅ Además, crear una vista “realTimeProducts.handlebars”, la cual vivirá en el endpoint “/realtimeproducts” en nuestro views router.
    
    ✅ El endpoint “/realtimeproducts” contendrá la misma lista de productos, sin embargo, ésta trabajará con websockets.

    ✅ Al trabajar con websockets, cada vez que creemos un producto nuevo, o bien cada vez que eliminemos un producto, se debe actualizar automáticamente en dicha vista la lista.

    ✅ Ya que la conexión entre una consulta HTTP y websocket no está contemplada dentro de la clase. Se recomienda que, para la creación y eliminación de un producto, Se cree un formulario simple en la vista  realTimeProducts.handlebars. Para que el contenido se envíe desde websockets y no HTTP. Sin embargo, esta no es la mejor solución, leer el siguiente punto.

    ✅ Si se desea hacer la conexión de socket emits con HTTP, deberás buscar la forma de utilizar el servidor io de Sockets dentro de la petición POST. ¿Cómo utilizarás un emit dentro del POST?
