FROM node:20 AS build
ARG VITE_BACKEND_URL=https://cuddly-space-lamp-5ggx96764ggp3ppvx-3001.app.github.dev/api/v1
WORKDIR /build
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build
FROM nginx AS final
WORKDIR /usr/share/nginx/html
COPY --from=build /build/dist .