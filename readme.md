## Aclaraciones para la entrega:

- El método getProducts está implementado dentro de la clase pero lo reutilizo en otras partes de mi código para actualizar el arreglo products por lo que para imprimir por consola creé el método printProducts()

### Scripts NPM:

- "start": Hace un watch del archivo app.js ya compilado.
- "watch": Watch para errores de TypeScript.
- "build": Compila todos los archivos .ts en .js.
- "dev": (levanta el servidor) watch para desarrollar sólo en ts sin compilar a js

Aspectos a incluir

❕ Crear una base de datos llamada “ecommerce” dentro de tu Atlas, crear sus colecciones “carts”, “messages”, “products” y sus respectivos schemas.

- Implementar una vista nueva en handlebars llamada chat.handlebars, la cual permita implementar un chat como el visto en clase. Los mensajes deberán guardarse en una colección “messages” en mongo (no es necesario implementarlo en FileSystem). El formato es: {user:correoDelUsuario, message: mensaje del usuario}

<br>

#### "RESUMEN PREENTREGA 2"

1.  ✅ Verificar funcionamiento persistencia MongoDB.
    <br>
2.  ✅ Migrar interacción a través del modelo a la clase manager.
    <br>
3.  ✅ Habilitar paginado (paginate) y ordenamiento (sort) en endpoint GET / de products.

        ##### Recibir parámetros por req.query:

        -✅ limit (items por página, por defecto 10).
        -✅ page (la página a recuperar con paginate, por defecto 1).
        -✅ query (el filtro a utilizar, por ej por category, por defecto todo).
        -✅ sort (1 ascendente, -1 descendente).

    <br>

4.  ✅ Habilitar nuevo endpoint GET para obtener datos de un carrito en particular, por ej GET /one/:cid.
    <br>
5.  Agregar métodos para gestión de array products

    -✅ "DELETE /:cid/products" Vacía el array del carrito cid
    -✅ "DELETE /:cid/products/:pid" Quita el producto pid del array del carrito cid
    -"PUT /:cid/products/pid" Agrega x cantidad del producto pid al array del carrito cid (la cantidad se debe pasar por req.body)

    ##### Alternativa:

    -"PUT /:cid/products/:pid/:qty" Agrega la cantidad qty del producto pid al array del carrito cid
    <br>

6.  ✅ Agregar ref a products en modelo carrito y habilitar populate (sea en modelo o en la propia consulta) para recibir detalle completo.
    <br>
7.  ✅ Crear view de products con paginación. (pasar directamente al render la info de Mongoose Paginate para utilizar esos datos en la plantilla y armar los botones de paginado).
    <br>
8.  Activar botón "Agregar a carrito" para cada producto en lista.



Desafío 5 - Refactor a nuestro login

codigos de errores

200 -> todo ok
400 -> error de solicitud (body)
401 -> error de AUTENTICACION
403 -> error de AUTORIZACION
500 -> error general al procesar




## Practica integradora 3


### Consigna

Con base en el proyecto que venimos desarrollando, toca solidificar algunos procesos

### Aspectos a incluir

➖ Realizar un sistema de recuperación de contraseña, la cual envíe por medio de un correo un botón que redireccione a una página para restablecer la contraseña (no recuperarla).
    🔹 link del correo debe expirar después de 1 hora de enviado.
    🔹 Si se trata de restablecer la contraseña con la misma contraseña del usuario, debe impedirlo e indicarle que no se puede colocar la misma contraseña.
    🔹 Si el link expiró, debe redirigir a una vista que le permita generar nuevamente el correo de restablecimiento, el cual contará con una nueva duración de 1 hora.


✅➖ Establecer un nuevo rol para el schema del usuario llamado “premium” el cual estará habilitado también para crear productos.

✅➖ Modificar el schema de producto para contar con un campo “owner”, el cual haga referencia a la persona que creó el producto.
    ✅🔹 Si un producto se crea sin owner, se debe colocar por defecto “admin”.
    🔹 El campo owner deberá guardar sólo el correo electrónico (o _id, lo dejamos a tu conveniencia) del usuario que lo haya creado (Sólo podrá recibir usuarios premium).

➖ Modificar los permisos de modificación y eliminación de productos para que:
    🔹 Un usuario premium sólo pueda borrar los productos que le pertenecen.
    🔹 El admin pueda borrar cualquier producto, aún si es de un owner.

➖ Además, modificar la lógica de carrito para que un usuario premium NO pueda agregar a su carrito un producto que le pertenece

➖ Implementar una nueva ruta en el router de api/users, la cual será /api/users/premium/:uid  la cual permitirá cambiar el rol de un usuario, de “user” a “premium” y viceversa.

