FROM node:lts-gallium AS base

RUN apt update && \
    export DEBIAN_FRONTEND=noninteractive && \
    apt install -y nginx

RUN mkdir -p /tmp/nginx/praeco
RUN mkdir -p /var/log/nginx
RUN mkdir -p /var/www/html
RUN chown www-data:www-data /var/www/html
WORKDIR /tmp/nginx/praeco
COPY package.json .

FROM base AS dependencies
RUN npm install --legacy-peer-deps --loglevel error

FROM base AS release
COPY --from=dependencies /tmp/nginx/praeco/node_modules ./node_modules
COPY . .

RUN npm run build
RUN cp -r dist/* /var/www/html
EXPOSE 8080
ENTRYPOINT ["./entrypoint.sh"]
