# Copiar el código fuente
COPY . .

# Construir la aplicación (Vite genera en /dist)
RUN npm run build

# =========================
# Etapa 2: Producción con Nginx
# =========================
FROM nginx:stable-alpine AS production

# Copiar los archivos del build
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración de Nginx (si tienes un archivo default.conf personalizado)
# COPY default.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]