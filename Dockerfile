# Usa una imagen base oficial de Node.js en Alpine para mantener la imagen ligera
FROM node:20-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Instala tsx globalmente
RUN npm install -g tsx

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto en el que tu aplicación estará escuchando (ajusta si es necesario)
EXPOSE 5000

# Define el comando por defecto para ejecutar tu aplicación con tsx
CMD ["tsx", "src/app.ts"]