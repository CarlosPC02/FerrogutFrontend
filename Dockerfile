# Stage 1: Build
FROM node:20-alpine as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build --configuration=production

# Stage 2: Serve
FROM nginx:stable
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/app-sistema /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
