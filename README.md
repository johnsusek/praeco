# praeco

Praeco is a GUI client for elastalert, geared towards logstash instances.

- Uses [bitsensor's elastalert API](https://github.com/bitsensor/elastalert) to manage rules.
- Rename praeco.config.json.default to praeco.config.json _and place it into public/_ before running and update its contents as needed.

## Running

Build docker image

```
docker build -t praeco .
```

Run docker image

```
docker run -v `pwd`/public/praeco.config.js:/var/www/html/praeco.config.js -it -p 8080:80 praeco
```

## Developing

```
npm install
npm run serve
```
