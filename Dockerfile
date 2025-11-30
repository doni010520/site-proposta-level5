# Etapa 1: Construção (Build)
FROM node:18-alpine as builder

WORKDIR /app

# --- AS DUAS LINHAS ABAIXO SÃO OBRIGATÓRIAS ---
# Elas permitem que o Easypanel injete a variável durante a construção
ARG VITE_WEBHOOK_URL
ENV VITE_WEBHOOK_URL=$VITE_WEBHOOK_URL
# ----------------------------------------------

COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servidor
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
