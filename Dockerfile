# =========================
# Etapa 1: Build
# =========================
FROM node:20-alpine AS build

WORKDIR /app

# Instalar dependencias
COPY package.json package-lock.json ./
RUN npm ci --silent

# Copiar código fuente
COPY . .

# Build (Vite genera /dist)
RUN npm run build


# =========================
# Etapa 2: Producción
# =========================
FROM nginx:stable-alpine AS production

# Copiar los archivos del build
COPY --from=build /app/dist /usr/share/nginx/html

# Si usás config personalizada
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
