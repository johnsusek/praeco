# praeco

Praeco is a GUI for elastalert, using [bitsensor's elastalert API](https://github.com/bitsensor/elastalert) to manage rules.

## Configuration

- Copy `praeco.config.json.default` to `public/praeco.config.json` before running and update its contents as needed.

## Running

A docker container is provided if you just want to run the app.

```
docker run -v `pwd`/public/praeco.config.js:/var/www/html/praeco.config.js -it -p 8080:80 servercentral/praeco
```

## Developing

If you want to develop for praeco, run the built it development server.

```
npm install
npm run serve
```

## Building

To build your own docker container from local changes.

```
docker build -t praeco .
```
