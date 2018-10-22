FROM alpine:3.7

RUN apk add --update nginx nodejs

RUN mkdir -p /tmp/nginx/praeco
RUN mkdir -p /var/log/nginx
RUN mkdir -p /var/www/html

WORKDIR /tmp/nginx/praeco

COPY . .

RUN npm install --silent
RUN npm run build

RUN cp -r dist/* /var/www/html

RUN chown nginx:nginx /var/www/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
