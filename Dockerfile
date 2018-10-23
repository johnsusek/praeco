# Base Node
FROM alpine:3.7 AS base
RUN apk add --update nginx nodejs
RUN mkdir -p /tmp/nginx/praeco
RUN mkdir -p /var/log/nginx
RUN mkdir -p /var/www/html
RUN chown nginx:nginx /var/www/html
WORKDIR /tmp/nginx/praeco
COPY package.json .

# Dependencies
FROM base AS dependencies
RUN npm install --silent

# Release
FROM base AS release
COPY --from=dependencies /tmp/nginx/praeco/node_modules ./node_modules
COPY . .
RUN npm run build
RUN cp -r dist/* /var/www/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
