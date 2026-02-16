FROM node:20.20.0-bookworm AS base

RUN apt update -qqy && \
    apt upgrade -qqy && \
    export DEBIAN_FRONTEND=noninteractive && \
    apt install -y nginx && \
    apt-get clean  && \
    rm -rf /var/lib/apt/lists/*

RUN export NODE_OPTIONS=--openssl-legacy-provider

RUN mkdir -p /tmp/nginx/praeco && \
    mkdir -p /var/log/nginx && \
    mkdir -p /var/www/html && \
    chown www-data:www-data /var/www/html
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
