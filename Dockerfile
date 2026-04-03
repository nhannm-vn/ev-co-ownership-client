# ===== Stage 1: Build React App =====
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./

RUN npm install

COPY . .

RUN npm run build

# ===== Stage 2: Serve bằng Nginx =====
FROM nginx:alpine

# Copy build từ stage 1 sang nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Nếu dùng CRA thì đổi dist -> build
# COPY --from=build /app/build /usr/share/nginx/html

# Expose port
EXPOSE 80

# Chạy nginx
CMD ["nginx", "-g", "daemon off;"]