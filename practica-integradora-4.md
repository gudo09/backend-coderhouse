### Para la practica integradora:

###### Consigna
Con base en el proyecto que venimos desarrollando, toca solidificar algunos procesos
###### Aspectos a incluir
- Mover la ruta suelta __/api/users/premium/:uid__ a un router específico para usuarios en <b>/api/users/</b> 
<i>"Acá la idea es que un user solicite pasarse a premium subiendo la documentacion correspondientes, una vez que ya tenga la documentacion subida, pasa automaticament a premium"</i>
<br>
- Modificar el modelo de User para que cuente con una nueva propiedad “documents” el cual será un array que contenga los objetos con las siguientes propiedades
  - <u>name</u>: String (Nombre del documento).
  - <u>reference</u>: String (link al documento).
<br>
- No es necesario crear un nuevo modelo de Mongoose para éste.
Además, agregar una propiedad al usuario llamada __“last_connection”__, la cuadeberá modificarse cada vez que el usuario realice un proceso de login y logout.
<br>
- Crear un endpoint en el router de usuarios __api/users/:uid/documents__ con el método POST que permita subir uno o múltiples archivos. Utilizar el middleware de Multer para poder recibir los documentos que se carguen y actualizar en el usuario su status para hacer saber que ya subió algún documento en particular.
<br>
- El middleware de multer deberá estar modificado para que pueda guardar en diferentes carpetas los diferentes archivos que se suban.
  - Si se sube una imagen de perfil, deberá guardarlo en una carpeta __profiles__, en caso de recibir la imagen de un producto, deberá guardarlo en una carpeta __products__, mientras que ahora al cargar un documento, multer los guardará en una carpeta __documents__.
<br>
- Modificar el endpoint __/api/users/premium/:uid__ para que sólo actualice al usuario a premium si ya ha cargado los siguientes documentos:
  - Identificación, Comprobante de domicilio, Comprobante de estado de cuenta
<br>
- En caso de llamar al endpoint, si no se ha terminado de cargar la documentación, devolver un error indicando que el usuario no ha terminado de procesar su documentación. 
(Sólo si quiere pasar de user a premium, no al revés)

###### Sugerencias
Corrobora que los usuarios que hayan pasado a premium tengan mayores privilegios de acceso que un usuario normal.
<br>

### Para el proyecto final: 

- Organizar por capas MVC, repository, singleton para BBDD si es posible.

- Usar variables de entorno. Agregar si se puede opciones de líneas de comando.

- Validar las cosas!! Por ejemplo con express-validator o joi en los middlewares.

- Buena gestión de autenticación y autorización (roles).

- Logging (registros de sucesos para winston).

- Documentación con Swagger. (No es necesario documentar toda la API).

- Vistas indispensables:
  - Registro
  - Login (datos locales y añadir un servicio de terceros)
  - Lista de productos
  - Vista de carrito (productos actuales, cambiar qty, quitar, checkout={revisar stock -> confirmar compra -> generar ticket})

- Se pide por lo menos un test unitario (Mocha, Chai) y uno de integración (Mocha, Chai, Supertest).

- Deploy del proyecto.

- Secuencia completa del proceso de compra (registrar, ingresar, agregar productos, modificar cantidades, controlar stock, confirmar (checkout) y generar tickets).