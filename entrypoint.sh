#!/bin/sh

if [ ! -z "${VUE_APP_BASE_URL}" ]; then
  echo "VUE_APP_BASE_URL=${VUE_APP_BASE_URL}"  > .env
  npm run build
  cp -r dist/* /var/www/html
fi

echo "Starting Nginx"
nginx -g 'daemon off;'