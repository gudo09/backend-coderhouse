- Organizar por capas MVC, repository, singleton para BBDD si es posible.

- Usar variables de entorno. Agregar si se puede opciones de líneas de comando.

- Validar las cosas!! Por ejemplo con express-validator o joi en los middlewares.

- Buena gestion de autenticación y autorización (roles).

- Logging (registros de sucesos para winston).

- Vistas indispensables:
  - Registro
  - Login (datos locales y añadir un servicio de terceros)
  - Lista de productos
  - Vista de carrito (productos actuales, cambiar qty, quitar, checkout={revisar stock -> confirmar compra -> generar ticket})
