
FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Recebe a URL da API
ARG VITE_API_BASE_URL

# Disponibiliza para o Vite
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Compila o React
RUN npm run build


FROM nginx:alpine AS production

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
