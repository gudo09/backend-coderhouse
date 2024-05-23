## Aclaraciones para la entrega:
  - El método getProducts está implementado dentro de la clase pero lo reutilizo en otras partes de mi código para actualizar el arreglo products por lo que para imprimir por consola creé el método printProducts()


### Scripts NPM:
  - "start": Hace un watch del archivo app.js ya compilado.
  - "watch-js": Modo watch para todos los archivos .ts y los compila a .js en tiempo real.
  - "build": Compila todos los archivos .ts en .js.
  - "dev-tsnd": watch para desarrollar sólo en ts sin compilar a js


Resumen primera practica integradora:

Continuar sobre el proyecto que has trabajado para tu ecommerce y configurar los siguientes elementos:

Aspectos a incluir

  ✅ Agregar el modelo de persistencia de Mongo y mongoose a tu proyecto.

  ❕ Crear una base de datos llamada “ecommerce” dentro de tu Atlas, crear sus colecciones “carts”, “messages”, “products” y sus respectivos schemas.
  
  ✅ Separar los Managers de fileSystem de los managers de MongoDb en una sola carpeta “dao”. Dentro de dao, agregar también una carpeta “models” donde vivirán los esquemas de MongoDB. La estructura deberá ser igual a la vista en esta clase

  ✅ Contener todos los Managers (FileSystem y DB) en una carpeta llamada “Dao”

  ❕ Reajustar los servicios con el fin de que puedan funcionar con Mongoose en lugar de FileSystem

  ✅ NO ELIMINAR FileSystem de tu proyecto.

  - Implementar una vista nueva en handlebars llamada chat.handlebars, la cual permita implementar un chat como el visto en clase. Los mensajes deberán guardarse en una colección “messages” en mongo (no es necesario implementarlo en FileSystem). El formato es:  {user:correoDelUsuario, message: mensaje del usuario}

  - Corroborar la integridad del proyecto para que todo funcione como lo ha hecho hasta ahora.

Importante!!

❗ Falta implementar el metodo Post /:cid/product/:pid para el endpoint de Carts