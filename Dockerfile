# Usa una imagen base oficial de Node.js en Alpine para mantener la imagen ligera
FROM node:20-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de configuración
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Expone el puerto en el que la aplicación se ejecutará
EXPOSE 5000

# Comando por defecto para ejecutar la aplicación
CMD ["npx", "nodemon"]