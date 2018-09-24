FROM alpine:3.7

RUN apk add --update nginx nodejs

RUN mkdir -p /tmp/nginx/praeco
RUN mkdir -p /var/log/nginx
RUN mkdir -p /var/www/html

COPY nginx_config/nginx.conf /etc/nginx/nginx.conf
COPY nginx_config/default.conf /etc/nginx/conf.d/default.conf

WORKDIR /tmp/nginx/praeco

COPY . .

RUN npm install
RUN npm run build

RUN cp -r dist/* /var/www/html

RUN chown nginx:nginx /var/www/html

EXPOSE 8080
ENTRYPOINT ["nginx", "-g", "daemon: off;"]
